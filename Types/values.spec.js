describe("Arrays", () => {
  test("arrays are containers for any type of value", () => {
    const a = [1, "2", [3]];
    expect(a.length).toBe(3);
    expect(a[0]).toBe(1);
    expect(a[1]).toBe("2");
    expect(a[2].length).toBe(1);
    expect(a[2][0]).toBe(3);
  });
  test("you can add values to the array after the declaration", () => {
    const a = [];
    a[0] = 1;
    a[1] = 2;
    expect(a[0]).toBe(1);
    expect(a[1]).toBe(2);
  });
  test("can have string keys/properties but they don't count toward the length of the array", () => {
    const a = [1];
    a["foobar"] = 2;
    expect(a.length).toBe(1);
    expect(a.foobar).toBe(2);
    expect(a["foobar"]).toBe(2);
  });
});

describe("Numbers", () => {
  test("the leading portion of a decimal, if 0, is optional", () => {
    const a = 0.42;
    const b = 0.42;
    expect(a).toEqual(b);
  });
  test("the trailing portion of a decimal, if 0, is optional", () => {
    const a = 42.0;
    const b = 42;

    expect(a).toEqual(b);
  });
  test("beware small numbers", () => {
    function numbersCloseEnoughToEqual(n1, n2) {
      return Math.abs(n1 - n2) < Number.EPSILON;
    }
    const a = 0.1;
    const b = 0.2;
    const c = 0.3;
    expect(a + b === c).toBe(false);
    expect(numbersCloseEnoughToEqual(a + b, c)).toBe(true);
  });
  test("testing integers", () => {
    expect(Number.isInteger(42)).toBe(true);
    expect(Number.isInteger(42.0)).toBe(true);
    expect(Number.isInteger(42.3)).toBe(false);
  });
  test("safe integers", () => {
    expect(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(Number.isSafeInteger(2 ** 53)).toBe(false);
    expect(Number.isSafeInteger(2 ** 53 - 1)).toBe(true);
  });
  test("NaN is never equal to other NaN value", () => {
    const a = 2 / "foo";
    expect(a).toBe(NaN);
    expect(a == NaN).toBe(false);
    expect(a === NaN).toBe(false);
    expect(NaN == NaN).toBe(false);
  });
  test("Number.IsNaN detects if the number is NaN", () => {
    const a = 2 / "foo";
    expect(Number.isNaN(a)).toBe(true);
  });
  test("infinity", () => {
    expect(1 / 0).toBe(Infinity);
    expect(1 / 0).toBe(Number.POSITIVE_INFINITY);
  });
  test("negative infinity", () => {
    expect(-1 / 0).toBe(-Infinity);
    expect(-1 / 0).toBe(Number.NEGATIVE_INFINITY);
  });
  test("negative zero", () => {
    expect(0 / -3).toBe(-0);
  });
  test("stringigy a -0 returns 0", () => {
    expect((-0).toString()).toBe("0");
  });
  test("Parsing -0 returns a -0", () => {
    expect(Number("-0")).toBe(-0);
  });
  test("Object.is handles all this special cases", () => {
    const a = 1 / "foo";
    const b = -3 * 0;
    expect(Object.is(a, NaN)).toBe(true);
    expect(Object.is(b, -0)).toBe(true);
    expect(Object.is(b, 0)).toBe(false);
  });
});

describe("undefined", () => {
  test("is it possible to define a variable called undefined", () => {
    const undefined = 2;
    expect(undefined).toBe(2);
  });
  test("the result of void operator is undefined", () => {
    const a = 42;
    const b = void a;

    expect(a).toBe(42);
    expect(b).toBe(undefined);
  });
});

describe("value-copy vs reference-sopy", () => {
  test("simple values are always assigned/passed by value-copy", () => {
    let a = 2;
    let b = a;
    b++;

    expect(a).toBe(2);
    expect(b).toBe(3);
  });

  test("Compound values and functions always create a copy of the reference on assignment or passing", () => {
    let a = [1, 2, 3];
    let b = a;
    b.push(4);

    expect(a).toEqual([1, 2, 3, 4]);
    expect(b).toEqual([1, 2, 3, 4]);
  });

  test("You can't use a reference to change where another reference is pointed", () => {
    let a = [1, 2, 3];
    let b = a;
    b = [1, 2, 3, 4];

    expect(a).toEqual([1, 2, 3]);
    expect(b).toEqual([1, 2, 3, 4]);
  });

  test("function parameters makes a copy of the reference", () => {
    function foo(x) {
      x.push(4);

      expect(x).toEqual([1, 2, 3, 4]);

      x = [4, 5, 6];
      expect(x).toEqual([4, 5, 6]);
    }

    let a = [1, 2, 3];

    foo(a);

    expect(a).toEqual([1, 2, 3, 4]);
  });

  test("to pass a compound object as value-copy you need to manually make a copy of it", () => {
    function foo(x) {
      x.push(4);

      expect(x).toEqual([1, 2, 3, 4]);

      x = [4, 5, 6];
      expect(x).toEqual([4, 5, 6]);
    }

    let a = [1, 2, 3];

    foo(a.slice());

    expect(a).toEqual([1, 2, 3]);
  });

  test("to pass a scalar primitive value as reference-copy, you need to wrap it in a compound value", () => {
    function foo(wrapper) {
      wrapper.x = 42;
    }

    let obj = {
      x: 1
    };

    foo(obj);

    expect(obj.x).toBe(42);
  });
});
