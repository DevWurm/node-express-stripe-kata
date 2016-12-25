export function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{};
  Object.getOwnPropertyNames(first).forEach(id => {
    (<any>result)[id] = (<any>first)[id];
  });

  Object.getOwnPropertyNames(second).forEach(id => {
    (<any>result)[id] = (<any>second)[id];
  });
  return result;
}

export function match<T>(o: any, ref: {new(...args: any[]): T} | T): o is T  {
  let oObject: Object;
  switch (typeof o) {
    case 'boolean': oObject = new Boolean(o); break;
    case 'number': oObject = new Number(o); break;
    case 'string': oObject = new String(o); break;
    case 'undefined': return ref === undefined;
    default: oObject = o;
  }

  if (isConstructor(ref)) {
    return (
      oObject instanceof ref
      ||
      getPropertyNames(new ref())
        .reduce((acc, curr) => (curr in oObject) && acc, true)
    );
  } else {
    return (
      getPropertyNames(ref)
        .reduce((acc, curr) => (curr in oObject) && acc, true)
    );
  }

}

export function getPropertyNames(x: Object): string[] {
  return Object.getOwnPropertyNames(x)
    .concat(Object.getPrototypeOf(x) ? getPropertyNames(Object.getPrototypeOf(x)) : []);
}

export function isConstructor<T>(x: { new (): T } | T): x is { new (): T } {
  return Boolean((<{ new (): T }> x).prototype);
}
