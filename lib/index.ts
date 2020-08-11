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
					Freeze((data as any)[p]);
				}
			}
		}
		return data as t<T>;
	}
}

type Optional<T> = Optional.t<T>
module Optional {
	export interface t<T> {
		Get<U>(none: () => U): T|U;
		Match<U,V>(some: (item: T) => U, none: () => V): U|V;
	}

	type maybe<T> = [] | [T];
	class Optional<T> implements t<T> {
		private contents: maybe<T> = [];
		constructor(item?: T) {
			if(item !== undefined) {
				this.contents = [item];
			}
		}

		private isNone(): boolean {
			return (this.contents.length === 0);
		}
		
		public Get<U>(none: () => U): T|U {
			if (this.isNone()) {
				return none();
			}
			return (this.contents[0] as T);
		}

		public Match<U,V>(some: (item: T) => U, none: () => V): U|V {
			return (this.isNone() ? none() : some(this.contents[0] as T));
		}
	}

	export function None<T>(): Optional<T> {
		return (new Optional());
	}

	export function Some<T>(item: T): Optional<T> {
		return (new Optional(item));
	}
}

export {
	Immutable,
	Optional
}