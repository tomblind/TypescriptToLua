import * as util from "../../util";

const expectNoUnpack: util.TapCallback = builder => expect(builder.getMainLuaCodeChunk()).not.toContain("unpack");

test("Tuple Return Access", () => {
    util.testFunction`
        /** @tupleReturn */
        function tuple(): [number, number, number] { return [3, 5, 1]; }
        return tuple()[2];
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return Destruct Declaration", () => {
    util.testFunction`
        /** @tupleReturn */
        function tuple(): [number, number, number] { return [3,5,1]; }
        const [,b,c] = tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return Destruct Assignment", () => {
    util.testFunction`
        /** @tupleReturn */
        function tuple(): [number, number] { return [3,6]; }
        let [a,b] = [1,2];
        [b,a] = tuple();
        return a - b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Static Method Return Destruct", () => {
    util.testFunction`
        class Test {
            /** @tupleReturn */
            static tuple(): [number, number, number] { return [3,5,1]; }
        }
        const [a,b,c] = Test.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Static Function Property Return Destruct", () => {
    util.testFunction`
        class Test {
            /** @tupleReturn */
            static tuple: () => [number, number, number] = () => [3,5,1];
        }
        const [a,b,c] = Test.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Non-Static Method Return Destruct", () => {
    util.testFunction`
        class Test {
            /** @tupleReturn */
            tuple(): [number, number, number] { return [3,5,1]; }
        }
        const t = new Test();
        const [a,b,c] = t.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Non-Static Function Property Return Destruct", () => {
    util.testFunction`
        class Test {
            /** @tupleReturn */
            tuple: () => [number, number, number] = () => [3,5,1];
        }
        const t = new Test();
        const [a,b,c] = t.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Interface Method Return Destruct", () => {
    util.testFunction`
        interface Test {
            /** @tupleReturn */
            tuple(): [number, number, number];
        }
        const t: Test = {
            tuple() { return [3,5,1]; }
        };
        const [a,b,c] = t.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Interface Function Property Return Destruct", () => {
    util.testFunction`
        interface Test {
            /** @tupleReturn */
            tuple: () => [number, number, number];
        }
        const t: Test = {
            tuple: () => [3,5,1]
        };
        const [a,b,c] = t.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Object Literal Method Return Destruct", () => {
    util.testFunction`
        const t = {
            /** @tupleReturn */
            tuple() { return [3,5,1]; }
        };
        const [a,b,c] = t.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Object Literal Function Property Return Destruct", () => {
    util.testFunction`
        const t = {
            /** @tupleReturn */
            tuple: () => [3,5,1]
        };
        const [a,b,c] = t.tuple();
        return b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return on Arrow Function", () => {
    util.testFunction`
        const fn = /** @tupleReturn */ (s: string) => [s, "bar"];
        const [a, b] = fn("foo");
        return a + b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return Inference", () => {
    util.testFunction`
        /** @tupleReturn */ interface Fn { (s: string): [string, string] }
        const fn: Fn = s => [s, "bar"];
        const [a, b] = fn("foo");
        return a + b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return Inference as Argument", () => {
    util.testFunction`
        /** @tupleReturn */ interface Fn { (s: string): [string, string] }
        function foo(fn: Fn) {
            const [a, b] = fn("foo");
            return a + b;
        }
        return foo(s => [s, "bar"]);
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return Inference as Elipsis Argument", () => {
    util.testFunction`
        /** @tupleReturn */ interface Fn { (s: string): [string, string] }
        function foo(_: number, ...fn: Fn[]) {
            const [a, b] = fn[0]("foo");
            return a + b;
        }
        return foo(0, s => [s, "bar"]);
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return Inference as Elipsis Tuple Argument", () => {
    util.testFunction`
        /** @tupleReturn */ interface Fn { (s: string): [string, string] }
        function foo(_: number, ...fn: [number, Fn]) {
            const [a, b] = fn[1]("foo");
            return a + b;
        }
        return foo(0, 0, s => [s, "bar"]);
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return in Spread", () => {
    util.testFunction`
        /** @tupleReturn */ function foo(): [string, string] {
            return ["foo", "bar"];
        }
        function bar(a: string, b: string) {
            return a + b;
        }
        return bar(...foo());
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return on Type Alias", () => {
    util.testFunction`
        /** @tupleReturn */ type Fn = () => [number, number];
        const fn: Fn = () => [1, 2];
        const [a, b] = fn();
        return a + b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return on Interface", () => {
    util.testFunction`
        /** @tupleReturn */ interface Fn { (): [number, number]; }
        const fn: Fn = () => [1, 2];
        const [a, b] = fn();
        return a + b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return on Interface Signature", () => {
    util.testFunction`
        interface Fn {
            /** @tupleReturn */ (): [number, number];
        }
        const fn: Fn = () => [1, 2];
        const [a, b] = fn();
        return a + b;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return on Overload", () => {
    util.testFunction`
        function fn(a: number): number;
        /** @tupleReturn */ function fn(a: string, b: string): [string, string];
        function fn(a: number | string, b?: string): number | [string, string] {
            if (typeof a === "number") {
                return a;
            } else {
                return [a, b as string];
            }
        }
        const a = fn(3);
        const [b, c] = fn("foo", "bar");
        return a + b + c
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return on Interface Overload", () => {
    util.testFunction`
        interface Fn {
            (a: number): number;
            /** @tupleReturn */ (a: string, b: string): [string, string];
        }
        const fn = ((a: number | string, b?: string): number | [string, string] => {
            if (typeof a === "number") {
                return a;
            } else {
                return [a, b as string];
            }
        }) as Fn;
        const a = fn(3);
        const [b, c] = fn("foo", "bar");
        return a + b + c
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return on Interface Method Overload", () => {
    util.testFunction`
        interface Foo {
            foo(a: number): number;
            /** @tupleReturn */ foo(a: string, b: string): [string, string];
        }
        const bar = {
            foo: (a: number | string, b?: string): number | [string, string] => {
                if (typeof a === "number") {
                    return a;
                } else {
                    return [a, b as string];
                }
            }
        } as Foo;
        const a = bar.foo(3);
        const [b, c] = bar.foo("foo", "bar");
        return a + b + c;
    `
        .tap(expectNoUnpack)
        .expectToMatchJsResult();
});

test("Tuple Return vs Non-Tuple Return Overload", () => {
    const luaHeader = `
        function fn(a, b)
            if type(a) == "number" then
                return {a, a + 1}
            else
                return a, b
            end
        end
    `;

    const tsHeader = `
        declare function fn(this: void, a: number): [number, number];
        /** @tupleReturn */ declare function fn(this: void, a: string, b: string): [string, string];
    `;

    util.testFunction`
        const [a, b] = fn(3);
        const [c, d] = fn("foo", "bar");
        return (a + b) + c + d;
    `
        .setTsHeader(tsHeader)
        .setLuaHeader(luaHeader)
        .expectToEqual("7foobar");
});

test("TupleReturn assignment", () => {
    util.testFunction`
        /** @tupleReturn */
        function abc(this: void): number[] {
            return [3, 5];
        }
        let [a, b] = abc();
        return { a, b };
    `.expectToMatchJsResult();
});

test("TupleReturn Single assignment", () => {
    util.testFunction`
        /** @tupleReturn */
        function abc(this: void): [number, string] {
            return [3, "foo"];
        }
        let a = abc();
        a = abc();
        return a;
    `.expectToMatchJsResult();
});

test("TupleReturn interface assignment", () => {
    const lua = util.testFunction`
        interface def {
            /** @tupleReturn */
            abc();
        } declare const jkl : def;
        let [a,b] = jkl.abc();
    `.getMainLuaCodeChunk();

    expect(lua).toContain("local a, b = jkl:abc()");
});

test("TupleReturn namespace assignment", () => {
    const lua = util.testFunction`
        declare namespace def {
            /** @tupleReturn */
            function abc(this: void) {}
        }
        let [a,b] = def.abc();
    `.getMainLuaCodeChunk();

    expect(lua).toContain("local a, b = def.abc()");
});

test("TupleReturn method assignment", () => {
    const lua = util.testFunction`
        declare class def {
        /** @tupleReturn */
        abc() { return [1,2,3]; }
        } const jkl = new def();
        let [a,b] = jkl.abc();
    `.getMainLuaCodeChunk();

    expect(lua).toContain("local a, b = jkl:abc()");
});

test("TupleReturn functional", () => {
    const code = `
        /** @tupleReturn */
        function abc(): [number, string] { return [3, "a"]; }
        const [a, b] = abc();
        return b + a;
    `;

    const result = util.transpileAndExecute(code);

    expect(result).toBe("a3");
});

test("TupleReturn single", () => {
    const code = `
        /** @tupleReturn */
        function abc(): [number, string] { return [3, "a"]; }
        const res = abc();
        return res.length
    `;

    const result = util.transpileAndExecute(code);

    expect(result).toBe(2);
});

test("TupleReturn in expression", () => {
    const code = `
        /** @tupleReturn */
        function abc(): [number, string] { return [3, "a"]; }
        return abc()[1] + abc()[0];
    `;

    const result = util.transpileAndExecute(code);

    expect(result).toBe("a3");
});

test("TupleReturn Cast", () => {
    const code = `
        /** @tupleReturn */
        function foo() {
            return ["a", "b", "c"] as [string, string, string];
        }
        const [a, b, c] = foo();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn Type Assertion", () => {
    const code = `
        /** @tupleReturn */
        function foo() {
            return <[string, string, string]>["a", "b", "c"];
        }
        const [a, b, c] = foo();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn as const", () => {
    const code = `
        /** @tupleReturn */
        function foo() {
            return ["a", "b", "c"] as const;
        }
        const [a, b, c] = foo();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn Type Explicit Return", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        function foo(): TupleReturn<[string, string, string]> {
            return ["a", "b", "c"];
        }
        const [a, b, c] = foo();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn Type Implicit Return", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        const tup: TupleReturn<[string, string, string]> = ["a", "b", "c"];

        function foo() {
            return tup;
        }

        const [a, b, c] = foo();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).toContain("unpack(tup)");
    expect(lua).not.toMatch(/unpack\(\s*foo\(nil\)\s*\)/);
});

test("TupleReturn Type Forward Return", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        function foo(): TupleReturn<[string, string, string]> {
            return ["a", "b", "c"];
        }

        function bar() {
            return foo();
        }

        const [a, b, c] = bar();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn Type Cast Return", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        function foo() {
            return ["a", "b", "c"] as TupleReturn<[string, string, string]>;
        }
        const [a, b, c] = foo();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn Type Type Assertion Return", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        function foo() {
            return <TupleReturn<[string, string, string]>>["a", "b", "c"];
        }
        const [a, b, c] = foo();
        return b;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn Type Wrap Return", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        function foo(): TupleReturn<number[]> {
            return [9, 8, 7];
        }
        const bar = foo();
        return bar[1];
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).toMatch(/{\s*foo\(nil\)\s*}/);
});

test("TupleReturn Type Infer Parameter", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        function foo<A extends unknown[]>(cb: () => TupleReturn<A>) {
            const [a, b, c] = cb();
            return b;
        }
        const bar = foo(() => ["a", "b", "c"]);
        return bar;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toContain("unpack");
});

test("TupleReturn Type Overload", () => {
    const code = `
        /** @tupleReturn */
        type TupleReturn<A extends unknown[]> = A & { __tupleReturn?: never };

        function foo<R extends unknown[]>(cb: () => TupleReturn<R>): TupleReturn<R>;
        function foo<R>(cb: () => R): R;
        function foo<R>(cb: () => R): R {
            return cb();
        }

        const arr: () => number[] = () => [1, 2, 3];
        const bar = foo(arr);

        const tup: () => TupleReturn<number[]> = () => [4, 5, 6, 7];
        const [a, b, c, d] = foo(tup);

        bar.push(c);
        return bar;
    `;
    util.testFunction(code).expectToMatchJsResult();

    const lua = util.testFunction(code).getMainLuaCodeChunk();
    expect(lua).not.toMatch(/{\s*foo\(nil, arr\)\s*}/);
    expect(lua).not.toContain("unpack");
});
