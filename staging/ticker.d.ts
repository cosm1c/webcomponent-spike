export interface Tick {
  readonly value: number;
  readonly strokeStyle: string;
}

export interface Ticker extends HTMLElement {

  readonly height: number;

  addTick(tick: Tick): void;
}
