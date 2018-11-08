describe("Natives", () => {
  test("can be used as a native constructor", () => {
    const a = new String("abc");

    expect(a.toString()).toEqual("abc");
  });

  test("the result of the constructor is an object wrapper around the primitive", () => {
    const a = new String("abc");

    const t = typeof a;
    expect(t).toBe("object");
    expect(a instanceof String).toBe(true);
  });
});

describe("Boxing wrappers", () => {
  test("javascript will automatically box the primitive value so that we can have functions and properties on it", () => {
    const a = "abc"; // This is better than new String("abc")
    expect(a.length).toBe(3);
    expect(a.toUpperCase()).toBe("ABC");
  });

  test("use valueOf to unbox", () => {
    const a = new String("abc");
    expect(a.valueOf()).toBe("abc");
  });
});

describe("Array", () => {
  test("The array constructor doesn't need the new keyword in front of it", () => {
    const a = new Array(1, 2, 3);
    expect(a).toEqual([1, 2, 3]);

    const b = Array(1, 2, 3);
    expect(b).toEqual([1, 2, 3]);
  });

  test("using the constructor with just one argument creates an array with undefined values on it", () => {
    const a = new Array(3);
    expect(a.length).toBe(3);
    expect(a).toEqual([undefined, undefined, undefined]);
    const c = [];
    c.length = 3;
    expect(c).toEqual([undefined, undefined, undefined]);
  });
});

describe("Object, Function and RegExp", () => {
  test("object constructor is optional", () => {
    const a = new Object();
    a.foo = "bar";
    expect(typeof a).toBe("object");
    expect(a.foo).toBe("bar");
    const b = { foo: "bar" };
    expect(typeof b).toBe("object");
    expect(b.foo).toBe("bar");
  });

  test("function constructor is optional", () => {
    const a = new Function("x", "return x * 2;");
    const b = a(4);
    expect(typeof a).toBe("function");
    expect(a instanceof Function).toBe(true);
    expect(b).toBe(8);
    const c = function(x) {
      return x * 2;
    };
    const d = c(4);
    expect(typeof c).toBe("function");
    expect(c instanceof Function).toBe(true);
    expect(d).toBe(8);
  });

  test("RegExp constructor is optional", () => {
    const a = /\w+/;
    const b = new RegExp("\\w+");
    const s = "6";
    expect(typeof a).toBe("object");
    expect(a instanceof RegExp).toBe(true);
    const c = a.test(s);
    expect(c).toBe(true);

    expect(typeof b).toBe("object");
    expect(b instanceof RegExp).toBe(true);
    const d = b.test(s);
    expect(d).toBe(true);
  });
});

describe("Date and error", () => {
  test("date constructor is needed because there's no literal form", () => {
    const a = new Date();
    expect(typeof a).toBe("object");
    expect(a instanceof Date).toBe(true);
  });

  test("error constructor is needed because there's no literal form", () => {
    const a = new Error();
    expect(typeof a).toBe("object");
    expect(a instanceof Error).toBe(true);
  });
});

describe("Symbols", () => {
  test("you cannot access or see its actual value", () => {
    const a = Symbol(Symbol.create);
    expect(typeof a).toBe("symbol");
  });
  test("you can define your own symbols", () => {
    const a = Symbol("my brand new symbol");
    expect(a.toString()).toBe("Symbol(my brand new symbol)");
  });
});
