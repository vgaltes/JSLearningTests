describe("Coercion", () => {
  test("explicit coercion", () => {
    const a = 42;
    const b = String(a);

    expect(b).toBe("42");
  });

  test("implicit coercion", () => {
    const a = 42;
    const b = a + "";

    expect(b).toBe("42");
  });

  describe("stringification", () => {
    test("for simple values it behaves like toString", () => {
      const a = JSON.stringify(42);
      expect(a).toBe("42");
    });
    test("undefined is omitted", () => {
      const a = JSON.stringify(undefined);
      expect(a).toBe(undefined);
      const b = JSON.stringify([1, undefined, 3]);
      expect(b).toEqual("[1,null,3]");
    });
    test("functions are omitted", () => {
      const a = JSON.stringify(function(x) {
        return x * 2;
      });
      expect(a).toBe(undefined);
      const b = JSON.stringify({
        a: 1,
        b: function(x) {
          return x * 2;
        }
      });
      expect(b).toEqual('{"a":1}');
    });
    test("toJSON is used when calling JSON.stringify", () => {
      const a = {
        foo: 42
      };
      a.toJSON = function() {
        return "the value is " + this.foo;
      };

      const b = JSON.stringify(a);
      expect(b).toBe('"the value is 42"');
    });
    test("replacer as an array of string indicates the properties we want to stringify", () => {
      const foo = {
        a: 1,
        b: 2,
        c: 3
      };
      const bar = JSON.stringify(foo, ["a", "b"]);
      expect(bar).toBe('{"a":1,"b":2}');
    });
    test("replacer as a function is called every time a property should be serialised", () => {
      const foo = { a: 1, b: 2, c: 3 };
      const bar = JSON.stringify(foo, function(k, v) {
        if (!k) return v; // for the first call to work
        if (k === "a") return v;
      });
      expect(bar).toBe('{"a":1}');
    });
  });
  describe("toNumber", () => {
    test("true becomes 1", () => {
      expect(Number(true)).toBe(1);
    });
    test("false becomes 0", () => {
      expect(Number(false)).toBe(0);
    });
    test("undefined becomes NaN", () => {
      expect(Number(undefined)).toBe(NaN);
    });
    test("null becomes 0", () => {
      expect(Number(null)).toBe(0);
    });
    test("if valueOf and toString are defined, valueOf is used", () => {
      const a = { valueOf: () => 42, toString: () => 43 };
      expect(Number(a)).toBe(42);
    });
    test("if valueOf is not defined, toString is used", () => {
      const a = { toString: () => 43 };
      expect(Number(a)).toBe(43);
    });
  });
  describe("toBoolean", () => {
    test("undefined becomes false", () => {
      expect(Boolean(undefined)).toBe(false);
    });
    test("null becomes false", () => {
      expect(Boolean(null)).toBe(false);
    });
    test("false becomes false", () => {
      expect(Boolean(false)).toBe(false);
    });
    test("+0 becomes false", () => {
      expect(Boolean(0)).toBe(false);
    });
    test("-0 becomes false", () => {
      expect(Boolean(-0)).toBe(false);
    });
    test("NaN becomes false", () => {
      expect(Boolean(NaN)).toBe(false);
    });
    test("Empty space becomes false", () => {
      expect(Boolean("")).toBe(false);
    });
    test("everything else is truthy", () => {
      const a = new Boolean(true); // It's an object
      const b = new Number(0); // It's an object
      const c = new String(""); // It's an object

      expect(Boolean(a && b && c)).toBe(true);
    });
  });
  describe("Explicit cohercion", () => {
    test("toString", () => {
      const a = 42;
      expect(a.toString()).toBe("42"); // 42 is boxed into an object and then toString is called
    });
    test("+ unary operator (string to number)", () => {
      const a = "42";
      expect(+a).toBe(42);
    });
    test("+ unary operator (date to number)", () => {
      const a = new Date();
      expect(+a).toBe(a.getTime());
    });
    test("parsing an integer is tolerant of non-numeric characters", () => {
      expect(parseInt("42px")).toBe(42);
      expect(parseInt("42px34")).toBe(42);
    });
    test("double exclamation mark coherce anything to boolean", () => {
      const a = 42;
      const b = "";
      expect(!!a).toBe(true);
      expect(!!b).toBe(false);
    });
  });
  describe("Implicit cohercion", () => {
    test("numbers to strings", () => {
      const a = "42";
      const b = "0";
      expect(a + b).toBe("420");

      const c = 42;
      const d = 0;
      expect(c + d).toBe(42);

      const e = [1, 2];
      const f = [3, 4];
      expect(e + f).toBe("1,23,4");

      expect("" + c).toBe("42");

      const g = {
        valueOf: () => 42,
        toString: () => 4
      };
      expect(g + "").toBe("42"); // Uses valueOf
      expect(String(g)).toBe("4"); // Uses toString
    });
    test("strings to numbers", () => {
      const a = "3.14";
      expect(a - 0).toBe(3.14);
      expect(a * 1).toBe(3.14);
      expect(a / 1).toBe(3.14);

      const b = [3];
      const c = [1];
      expect(b - c).toBe(2); // The arrays are first coherced to strings, and then to numbers.
    });
    test("boolean to number", () => {
      function onlyOne() {
        let sum = 0;
        for (let i = 0; i < arguments.length; i++) {
          if (arguments[i]) {
            sum += arguments[i];
          }
        }
        return sum === 1;
      }

      const a = true;
      const b = false;

      expect(onlyOne(b, a, b, b, b)).toBe(true);
    });
    test("Operators && and ||", () => {
      const a = 42;
      const b = "abc";
      const c = null;

      expect(a || b).toBe(42); // if a is falsy, then select b, otherwise select a
      expect(a && b).toBe("abc"); // if a is truthy, then select b, otherwise select a
      expect(c || b).toBe("abc");
      expect(c && b).toBe(null);
    });
    test("== allows coercion", () => {
      const a = 42;
      const b = "42";
      expect(a == b).toBe(true);
    });
    test("=== disallows coercion", () => {
      const a = 42;
      const b = "42";
      expect(a === b).toBe(false);
    });
  });
  describe("Abstract relational comparision", () => {
    test("call first ToPrimitive coercion and if either call is not a string both values are coerced to number values", () => {
      const a = [42];
      const b = ["43"];

      expect(a < b).toBe(true);
    });
    test("call first ToPrimitive coercion and if both values are strings, simple lexicographic comparision is used", () => {
      const a = ["42"];
      const b = ["043"];

      expect(a < b).toBe(false);
    });
  });
});
