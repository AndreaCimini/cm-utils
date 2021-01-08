// Any type

interface AnyInterface {} // tslint:disable-line

type AnyConstructor = new() => AnyInterface;

export const Any: AnyConstructor = class AnyClass implements AnyInterface {
  constructor() {}
};

// Multi type: for example a variable that can be both string and number

interface MultiInterface {
  types: any[];
}

type MultiConstructor = new(...types) => MultiInterface;

export const Multi: MultiConstructor = class MultiClass implements MultiInterface {
  types: any[];

  constructor(...types) {
    this.types = [...types];
  }
};

// Tuple type: for example an array where first element is a string and second element is a number

interface TupleInterface {
  types: any[];
}

type TupleConstructor = new(...types) => TupleInterface;

export const Tuple: TupleConstructor = class TupleClass implements TupleInterface {
  types: any[];

  constructor(...types) {
    this.types = [...types];
  }
};
