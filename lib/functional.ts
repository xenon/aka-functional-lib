type Optional<T> = Optional.t<T>
module Optional {
	export type t<T> = [T] | [];
	// Type Constructors
	export function Some<T>(data: T): t<T> { return [data]; }
	export function None<T>(): t<T> { return []; }
	// Functions
	export function IsSome<T>(data: t<T>): boolean {
		return (data.length == 1);
	}
	export function IsNone<T>(data: t<T>): boolean {
		return !(IsSome(data));
	}
	export function Get<T>(data: t<T>): T {
		if (IsNone(data)) {
			throw new TypeError("Optional: Get may only be used with Some<T>.");
		}
		return (data[0] as T);
	}
	export function Unwrap<T,U,V>(data: t<T>, some: (val: T) => U, none: () => V): U|V {
		return (IsSome(data) ? some((data[0] as T)) : none());
	}
}

type Immutable<T> = Immutable.t<T>;
module Immutable {
	export type t<T> = 
		T extends Function | boolean | number | string | null | undefined ? T :
		T extends Array<infer U> ? ReadonlyArray<t<U>> :
		T extends Map<infer K, infer V> ? ReadonlyMap<t<K>, t<V>> :
		T extends Set<infer S> ? ReadonlySet<t<S>> :
		{readonly [P in keyof T]: t<T[P]>}
	// Type Constructors
	export function Freeze<T>(data: T): t<T> {
		Object.freeze(data);
		if (data !== null) {
			for (let p in Object.getOwnPropertyNames(data)) {
				if (Object.prototype.hasOwnProperty.call(data, p) && typeof (data as any)[p] === 'object') {
					Immutable.Freeze((data as any)[p]);
				}
			}
		}
		return data as t<T>;
	}
}