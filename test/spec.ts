/**
 * Type alias resolves to `true` if and only if L is equal to R.
 * @typeparam L - Left hand side type
 * @typeparam R - Rigth hand side type
 */
type ExactTrue<L, R> =
	0 extends (1 & L)
		? 0 extends (1 & R)
			? true
			: "L is `any` but R is NOT `any`"
		: 0 extends (1 & R)
			? "L is NOT `any` but R is `any`"
			: [L] extends [R]
				? [R] extends [L]
					? (<_>() => _ extends L ? 1 : 0) extends (<_>() => _ extends R ? 1 : 0)
						? true
						: "Variance in `readonly` between L and R"
					: "R is not assignable to L"
				: "L is not assignable to R";

/**
 * Type alias resolves to `false` if and only if L is not equal R.
 * @typeparam L - Left hand side type
 * @typeparam R - Rigth hand side type
 */
type ExactFalse<L, R> =
	0 extends (1 & L)
		? 0 extends (1 & R)
			? "L is `any` and R is `any`"
			: false
		: 0 extends (1 & R)
			? false
			: [L] extends [R]
				? [R] extends [L]
					? (<_>() => _ extends L ? 1 : 0) extends (<_>() => _ extends R ? 1 : 0)
						? "L is equal to R"
						: false
					: false
				: false;

/** @param v - `true` when L is the same as R */
export declare function Exact<L, R>(v: ExactTrue<L, R>): void;

/** @param v - `false` when L is not the same as R */
export declare function Exact<L, R>(v: ExactFalse<L, R>): void;

/** @param v - `true` when L is the same as R */
export declare function Exact<L, R>(l: L, r: R, v: ExactTrue<L, R>): void;

/** @param v - `false` when L is not the same as R */
export declare function Exact<L, R>(l: L, r: R, v: ExactFalse<L, R>): void;

/** @param v - `true` when L is the same as R */
export declare function Exact<L>(l: L): {
	<R>(v: ExactTrue<L, R>): void;
	<R>(r: R, v: ExactTrue<L, R>): void;
};

/** @param v - `false` when L is not the same as R */
export declare function Exact<L>(l: L): {
	<R>(v: ExactFalse<L, R>): void;
	<R>(r: R, v: ExactFalse<L, R>): void;
};

/** @param v - `true` when L is assignable to R, otherwise `false`. */
export declare function Assignable<L, R>(
	v: [L] extends [R]
		? true
		: false
): void;
