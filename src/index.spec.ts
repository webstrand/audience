/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exact, Assignable } from "./spec";
import type { Audience, Spectator } from "./index";

/* eslint-disable @typescript-eslint/indent */
/* ///////////////// */namespace CheckAudienceAssignability {// @ts-expect-error
if(1 as 0) return;

type To<T> = T;
interface Foo { x: string }
interface Bar extends Foo { x: "bar" }

type FooParam = Spectator<(x: Foo) => void>;
type BarParam = Spectator<(x: Bar) => void>;
type FooRet = Spectator<(x: 1) => Foo>;
type BarRet = Spectator<(x: 1) => Bar>;

// -------------------------------------------------------------------------- //
// Since `Bar` extends `Foo`, an `Audience.Iterable<BarParam>` should be a
// subclass of `Audience<FooParam>` since a `(x: Foo) => void` function can be
// called with a `Bar` object without error.
Assignable<Audience.Iterable<BarParam>, To<Audience<FooParam>>>(true);

interface Base1 { onEvent: Audience<FooParam> }
declare class Child1 implements Base1 { onEvent: Audience.Iterable<BarParam>; }
// -------------------------------------------------------------------------- //
// `Audience.Iterable<BarParam>` should not be a subclass of
// `Audience.Iterable<FooParam>` however, because if it were, the
// `[Symbol.iterator]()` method would return functions that accept only
// `(x: Bar) => void` with the type signature `(x: Foo) => void` which is a type
// error.
Assignable<Audience.Iterable<BarParam>, To<Audience.Iterable<FooParam>>>(false);

interface Base2 { onEvent: Audience.Iterable<FooParam> }
// @ts-expect-error:
// Type 'IterableIterator<Readonly<Spectator<(x: Bar) => void>>>' is not
// assignable to type 'IterableIterator<Readonly<Spectator<(x: Foo) => void>>>'.
declare class Child2 implements Base2 { onEvent: Audience.Iterable<BarParam>; }
// -------------------------------------------------------------------------- //
// Since `Bar` extends `Foo`, an `Audience.Iterable<BarRet>` should be a
// subclass of `Audience.Iterable<FooRet>` since `(x: 1) => Bar` can be assigned
// to `(x: 1) => Foo`.
Assignable<Audience.Iterable<BarRet>, To<Audience<FooRet>>>(true);
Assignable<Audience.Iterable<BarRet>, To<Audience.Iterable<FooRet>>>(true);

interface Base3 { onEvent: Audience.Iterable<FooRet> }
declare class Child3 implements Base3 { onEvent: Audience.Iterable<BarRet>; }
// -------------------------------------------------------------------------- //
// Incompatible function signatures must not be assignable to one another. Fixed
// this issue by adding a non-generic overload to [[Audience#join]].
Assignable<Audience<BarRet>, To<Audience<FooParam>>>(false);
Assignable<Audience<FooParam>, To<Audience<BarRet>>>(false);
Assignable<Audience.Iterable<BarRet>, To<Audience.Iterable<FooParam>>>(false);
Assignable<Audience.Iterable<FooParam>, To<Audience.Iterable<BarRet>>>(false);

interface Base4 { onEvent: Audience<FooParam> }
// @ts-expect-error:
// Type '(x: Foo) => void' is not assignable to type '(x: 1) => Bar'.
declare class Child4 implements Base4 { onEvent: Audience.Iterable<BarRet>; }
// -------------------------------------------------------------------------- //
// Audiences should be assignable when their Spectator types are assignable.
Assignable<Audience<BarParam & { x?: 1 }>, To<Audience<FooParam>>>(true);
Assignable<Audience<BarParam & { x: 1 }>, To<Audience<FooParam>>>(false);
Assignable<Audience<BarParam & { x?: 1 }>, To<Audience<FooParam & { x: 1 }>>>(true);
// -------------------------------------------------------------------------- //
declare let a1: Audience<Spectator<(x: "foo") => "foo"> & { test?: true }>;

// Join must infer the parameters and return type of fn.
const j1 = a1.join({ fn(x) { Exact(x)<"foo">(true); return x }, x: 1 });
const j2 = a1.join({ fn(x) { Exact(x)<"foo">(true); return x } });

// Join must infer the correct this-type for fn.
a1.join({ fn(x) {
	Exact(this.x)<number>(true);
	Exact(this.test)<undefined | true>(true);
	return x;
}, x: 7 });

// Join must not accept wrong function types
// @ts-expect-error:
// Type '(x: number) => string' is not assignable to type '(x: "foo") => "foo"'.
a1.join({ fn(x: number) { return "foo" } });

// Join must not return `unknown` and must return the same type as the provided
// spectator.
Exact(j1)<{ fn(x: "foo"): "foo", x: number } & { test?: true } & Spectator<(x: "foo") => "foo">>(true);
Exact(j2)<{ fn(x: "foo"): "foo" } & { test?: true } & Spectator<(x: "foo") => "foo">>(true);

// Part must accept normal types
a1.part(j1);
a1.part(j2);
a1.part(null);
a1.part(undefined);
a1.part({ fn(x) { return x } });
// @ts-expect-error:
// Property 'fn' is missing in type '{}'
a1.part({ test: true });

// Joined should work as a type-guard
declare let j3: typeof j1 | null;
Exact(j1, j3, false);
if(a1.joined(j3)) { Exact(j1, j3, true) }

// Dissolve exists
a1.dissolve();
// -------------------------------------------------------------------------- //
declare let a2: Audience.Iterable<Spectator<(x: "foo") => "foo"> & { test?: true }>;

// [Symbol.iterator] produces correctly typed spectator objects.
const j4 = a2[Symbol.iterator]();
Exact(j4)<IterableIterator<Readonly<Spectator<(x: "foo") => "foo"> & { test?: true }>>>(true);
/* ///////////////////////////////////////////////////////////////////////// */}
/* eslint-enable @typescript-eslint/indent */
