export abstract class Result<T, E> {
  protected constructor() {
      if (this.isSuccess() === this.isError()) {
          throw new Error("Do not subclass Result<T, E>. Subclass Success<T, E> or Failure<T, E> instead.");
      }
  }

  isSuccess(): this is Success<T, E> {
    return this instanceof Success;
  }

  isError(): this is Failure<T, E> {
    return this instanceof Failure;
  }

  match<R>(onSuccess: (val: T) => R, onError: (err: E) => R): R {
    return this.isSuccess() ? onSuccess(this.value) : onError(this.value as E);
  }

  abstract get value(): T | E;

  toString(): string {
    const val = this.value;
    return typeof val === "string" ? val : JSON.stringify(val);
  }
}

export class Success<T, E> extends Result<T, E> {
  private readonly _val: T;

  constructor(value: T) {
    super();
    this._val = value;
  }

  get value(): T {
    return this._val;
  }
}

export class Failure<T, E> extends Result<T, E> {
  private readonly _err: E;

  constructor(err: E) {
    super();
    this._err = err;
  }

  get value(): E {
    return this._err;
  }
}