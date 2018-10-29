describe("Built-in types", () => {
  test("undefined is a built-in type", () => {
    expect(typeof undefined).toBe("undefined");
  });
  test("boolean is a built-in type", () => {
    expect(typeof true).toBe("boolean");
  });
  test("number is a built-in type", () => {
    expect(typeof 42).toBe("number");
  });
  test("string is a built-in type", () => {
    expect(typeof "42").toBe("string");
  });
  test("object is a built-in type", () => {
    expect(typeof { life: 42 }).toBe("object");
  });
  test("symbol is a built-in type", () => {
    expect(typeof Symbol()).toBe("symbol");
  });
  test("null is a built-in type, but typeof returns object", () => {
    const a = null;
    const isNull = !a && typeof a === "object";
    expect(isNull).toBe(true);
  });
  test("a function is an object, but typeof returns function", () => {
    const f = function(a, b) {
      return a + b;
    };

    expect(typeof f).toBe("function");
  });
  test("as a function is an object, can have properties. Length return the number of parameters", () => {
    const f = function(a, b) {
      return a + b;
    };
    expect(f.length).toBe(2);
  });
  test("an array is an object", () => {
    expect(typeof [1, 2, 3]).toBe("object");
  });
});

describe("Values as types", () => {
  test("variables doesn't have types, values have types", () => {
    let a = 42;
    expect(typeof a).toBe("number");
    a = "42";
    expect(typeof a).toBe("string");
  });
  test("variables that doesn't have currently a value have the undefined type and value", () => {
    let a, b;
    expect(typeof a).toBe("undefined");
    a = 42;
    expect(typeof a).toBe("number");
    a = b;
    expect(typeof a).toBe("undefined");
  });
  test("typeof of an undeclared variable is undefined", () => {
    expect(typeof a).toBe("undefined");
  });
});
