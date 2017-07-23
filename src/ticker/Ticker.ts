import {RingBuffer} from '../ringbuffer/RingBuffer';

const _currentScript = document.currentScript;

export interface Tick {
  readonly value: number;
  readonly strokeStyle: string;
}

class TickItem {
  constructor(public readonly timeStamp: number,
              public readonly tick: Tick) {
  }
}

/*
 * TODO: consider implementing these features:
 * - start/pause methods -- default to not running
 * - slowdownFactor (setTimeout(delayAmount, requestAnimationFrame)
 * - handle resize
 */
export class Ticker extends HTMLElement {

  private static readonly gradients = 15;

  private readonly _ringBuffer: RingBuffer<TickItem> = new RingBuffer(1024);

  private _canvasElem: HTMLCanvasElement;
  private _context2D: CanvasRenderingContext2D;
  private _lastAnimationTimeStamp: number = 0;
  private _width: number;
  private _height: number;

  private constructor() {
    super();
  }

  get height(): number {
    return this._height;
  }

  connectedCallback() {
    console.debug('Ticker connectedCallback');

    const shadowRoot = this['attachShadow']({mode: 'open'});
    const t = _currentScript.ownerDocument.querySelector('template') as HTMLTemplateElement;
    const instance = t.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    this._canvasElem = shadowRoot.querySelector('canvas') as HTMLCanvasElement;
    let context = this._canvasElem.getContext('2d');
    if (!context) {
      throw new Error('No Context from provided Canvas');
    }
    this._context2D = context;
    this._context2D.lineWidth = 1;
    this._context2D.imageSmoothingEnabled = false;
    // this._context2D.fillStyle = 'blue';

    this.initCanvasForHiDpi();

    window.requestAnimationFrame(this.refresh);
  }

  disconnectedCallback() {
    console.debug('Ticker disconnectedCallback');
  }

  attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
    console.debug(`Ticker attributeChangedCallback((attrName=${attrName}, oldVal=${oldVal}, newVal=${newVal})`);
  }

  adoptedCallback() {
    console.debug('Ticker adoptedCallback');
  }

  addTick(tick: Tick): void {
    this._ringBuffer.add(new TickItem(Math.round(window.performance.now()), tick));
  }

  private refresh: () => void =
    () => {
      // console.debug('Refresh start');
      const now = Math.round(window.performance.now());
      this._context2D.clearRect(0, 0, this._width, this._height);
      this._lastAnimationTimeStamp = now;
      // this.renderTape(0, this._width);
      this.animateFrame(now);
      // console.debug('Refresh end');
    };

  private frameCount = 0;
  private animateFrame: (timeStamp: number) => void =
    (timeStamp: number) => {
      const now = Math.round(timeStamp);
      const timeLapsed = now - this._lastAnimationTimeStamp;
      // console.debug(`frame=${this.frameCount} now=${now} timeLapsed=${timeLapsed}`);

      try {
        this.scrollCanvas(timeLapsed);
        this.renderTape(now, timeLapsed);
        this.renderTicks(now, timeLapsed);

      } catch (e) {
        console.error('animateFrame error', e);

      } finally {
        this._lastAnimationTimeStamp = now;
        // TODO: remove frameCount limit used for debugging
        this.frameCount++;
        if (this.frameCount < 40) {
          window.requestAnimationFrame(this.animateFrame);
        } else {
          console.info('Stopping animation due to frameCount limit hack');
        }
      }
    };

  private scrollCanvas(dx: number) {
    const sw = this._width - dx;
    // console.debug(`scrollCanvas width=${this._width} dx=${dx} sw=${sw}`);
    const imageData = this._context2D.getImageData(dx, 0, sw, this._height);
    this._context2D.clearRect(sw, 0, dx, this._height);
    this._context2D.putImageData(imageData, 0, 0);
  }

  private renderTape(now: number, timeLapsed: number): void {
    const end = this._width - timeLapsed;
    this._context2D.strokeStyle = 'grey';
    for (let x = this._width - (now % Ticker.gradients); x >= end; x -= Ticker.gradients) {
      this._context2D.beginPath();
      this._context2D.moveTo(x, 0);
      this._context2D.lineTo(x, this._height);
      this._context2D.stroke();
    }
  }

  private renderTicks(now: number, timeLapsed: number): void {
    const end = now - timeLapsed;
    this._ringBuffer.forEachReverse((tickItem: TickItem) => {
      if (tickItem.timeStamp < end) {
        return false;
      }

      this._context2D.strokeStyle = tickItem.tick.strokeStyle;
      this._context2D.fillRect(
        this._width - (now - tickItem.timeStamp),
        this.valueWithinHeight(tickItem.tick.value),
        1,
        1
      );
      return true;
    });
  }

  private valueWithinHeight(value: number): number {
    return Math.min(Math.max(Math.round(value), 0), this._height);
  }

  private initCanvasForHiDpi() {
    const width = this._canvasElem.clientWidth - 2; // 1px border on left and right
    const height = this._canvasElem.clientHeight;

    this._canvasElem.style.width = width + 'px';
    this._canvasElem.style.height = height + 'px';

    this._canvasElem.width = width * window.devicePixelRatio;
    this._canvasElem.height = height * window.devicePixelRatio;

    this._width = this._canvasElem.width;
    this._height = this._canvasElem.height;

    // console.debug(`xPixelRatio=${xPixelRatio} yPixelRatio=${yPixelRatio}`);
    // console.debug(`canvasElem.width=${this._canvasElem.width} canvasElem.height=${this._canvasElem.height}`);
    // console.debug(`canvasElem.style.width=${this._canvasElem.width} canvasElem.style.height=${this._canvasElem.style.height}`);
  }
}
