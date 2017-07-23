import {RingBuffer} from '../../../src/ringbuffer/RingBuffer';

describe('RingBuffer', () => {

  let ringBuffer: RingBuffer<number>;

  beforeEach(() => {
    ringBuffer = new RingBuffer<number>(3);
  });

  it('initial toArray is empty', () => {
    const toArray = ringBuffer.toArray();

    expect(Array.isArray(toArray)).toBe(true);
    expect(toArray).toEqual([]);
  });

  it('adds items', () => {
    ringBuffer.add(1);
    expect(ringBuffer.toArray()).toEqual([1]);

    ringBuffer.add(2);
    expect(ringBuffer.toArray()).toEqual([1, 2]);

    ringBuffer.add(3);
    expect(ringBuffer.toArray()).toEqual([1, 2, 3]);

    ringBuffer.add(4);
    expect(ringBuffer.toArray()).toEqual([2, 3, 4]);

    ringBuffer.add(5);
    expect(ringBuffer.toArray()).toEqual([3, 4, 5]);

    ringBuffer.add(6);
    expect(ringBuffer.toArray()).toEqual([4, 5, 6]);

    ringBuffer.add(7);
    expect(ringBuffer.toArray()).toEqual([5, 6, 7]);

    ringBuffer.add(8);
    expect(ringBuffer.toArray()).toEqual([6, 7, 8]);
  });

  describe('forEach', () => {

    it('iterates empty buffer', () => {
      let values: Array<number> = [];
      ringBuffer.forEach((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([]);
    });

    it('exits early when iterator does not return true', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);

      let values: Array<number> = [];
      ringBuffer.forEach((item: number) => {
        values.push(item);
        return item < 2;
      });
      expect(values).toEqual([1, 2]);
    });

    it('iterates partial buffer', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);

      let values: Array<number> = [];
      ringBuffer.forEach((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([1, 2]);
    });

    it('iterates full buffer', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);

      let values: Array<number> = [];
      ringBuffer.forEach((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([1, 2, 3]);
    });

    it('iterates over full buffer', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);
      ringBuffer.add(4);

      let values: Array<number> = [];
      ringBuffer.forEach((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([2, 3, 4]);
    });

    it('indicates unfilled noItem accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);

      let result = ringBuffer.forEach(() => {
        return false;
      });
      expect(result).toEqual(false);
    });

    it('indicates unfilled item accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);

      let result = ringBuffer.forEach(() => {
        return true;
      });
      expect(result).toEqual(true);
    });
    it('indicates filled noItem accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);
      ringBuffer.add(4);

      let result = ringBuffer.forEach(() => {
        return false;
      });
      expect(result).toEqual(false);
    });

    it('indicates filled item accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);
      ringBuffer.add(4);

      let result = ringBuffer.forEach(() => {
        return true;
      });
      expect(result).toEqual(true);
    });
  });

  describe('forEachReverse', () => {
    it('iterates empty buffer', () => {
      let values: Array<number> = [];
      ringBuffer.forEachReverse((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([]);
    });

    it('iterates partial buffer', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);

      let values: Array<number> = [];
      ringBuffer.forEachReverse((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([2, 1]);
    });

    it('iterates full buffer', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);

      let values: Array<number> = [];
      ringBuffer.forEachReverse((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([3, 2, 1]);
    });

    it('iterates full buffer', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);
      ringBuffer.add(4);

      let values: Array<number> = [];
      ringBuffer.forEachReverse((item: number) => {
        values.push(item);
        return true;
      });
      expect(values).toEqual([4, 3, 2]);
    });

    it('indicates unfilled noItem accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);

      let result = ringBuffer.forEachReverse(() => {
        return false;
      });
      expect(result).toEqual(false);
    });

    it('indicates unfilled item accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);

      let result = ringBuffer.forEachReverse(() => {
        return true;
      });
      expect(result).toEqual(true);
    });

    it('indicates filled noItem accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);
      ringBuffer.add(4);

      let result = ringBuffer.forEachReverse(() => {
        return false;
      });
      expect(result).toEqual(false);
    });

    it('indicates filled item accepted', () => {
      ringBuffer.add(1);
      ringBuffer.add(2);
      ringBuffer.add(3);
      ringBuffer.add(4);

      let result = ringBuffer.forEachReverse(() => {
        return true;
      });
      expect(result).toEqual(true);
    });
  });

});
