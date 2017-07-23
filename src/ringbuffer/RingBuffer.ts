
// TODO: prefer forward iteration
export class RingBuffer<A> {

  // TODO: pre-allocate array size => new Array(4)
  private buffer: any[];
  private writeIndex: number = 0;
  private size: number = 0;

  constructor(private readonly capacity: number) {
    if (capacity < 1) {
      throw new Error(`Invalid RingBuffer capacity ${capacity}`);
    }
    this.buffer = new Array<A>(capacity);
  }

  add(value: A): void {
    this.buffer[this.writeIndex] = value;
    this.size++;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;
  }

  toArray(): Array<A> {
    if (this.size < this.capacity) {
      return this.buffer.slice(0, this.writeIndex);
    }
    return this.buffer.slice(this.writeIndex)
      .concat(this.buffer.slice(0, this.writeIndex));
  }

  forEach(iteratee: (a: A) => boolean): boolean {
    if (this.size === 0) {
      return false;

    } else if (this.size === 1) {
      return iteratee(this.buffer[0]);

    } else if (this.size <= this.capacity) {
      let result = false;
      for (let i = 0; i < this.size; i++) {
        if (!iteratee(this.buffer[i])) {
          return result;
        }
        result = true;
      }
      return result;

    } else {
      let x = this.writeIndex,
        outcome = false;
      do {
        if (!iteratee(this.buffer[x])) {
          return outcome;
        }
        outcome = true;

        x = (x + 1) % this.capacity;
      } while (x !== this.writeIndex);
      return outcome;
    }
  }

  forEachReverse(iteratee: (a: A) => boolean): boolean {
    if (this.size === 0) {
      return false;

    } else if (this.size === 1) {
      return iteratee(this.buffer[0]);

    } else if (this.size <= this.capacity) {
      let result = false;
      for (let i = this.size - 1; i >= 0; i--) {
        if (!iteratee(this.buffer[i])) {
          return result;
        }
        result = true;
      }
      return result;

    } else {
      let x = this.writeIndex,
        outcome = false;
      do {
        x = (x === 0) ? this.capacity - 1 : x - 1;

        if (!iteratee(this.buffer[x])) {
          return outcome;
        }
        outcome = true;
      } while (x !== this.writeIndex);
      return outcome;
    }
  }

}
