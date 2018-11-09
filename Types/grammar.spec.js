describe("Expression side effects", () => {
  test("statement series comma operator", () => {
    let a = 42;
    const b = (a++, a);
    expect(a).toBe(43);
    expect(b).toBe(43);
  });
});

describe("Operator precedence", () => {
  test("&& has precedence over ||", () => {
    const grouped1 = (false && true) || true;
    // eslint-disable-next-line prettier/prettier
    const andpersandFirst = (false && true) || true;
    expect(andpersandFirst).toBe(grouped1);

    const grouped2 = true || (false && false);
    // eslint-disable-next-line prettier/prettier
    const orFirst = true || (false && false);
    expect(orFirst).toBe(grouped2);
  });
});
