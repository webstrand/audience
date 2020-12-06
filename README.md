# Audience
Audience is a library which tries to implement a bare-minimum, yet flexible, event system. Unlike `EventEmitter` and `EventTarget`, which users are meant to extend through sub-classes, `Audience`s are composed into objects and classes as individual properties. This composition makes it easy to guarantee that both events and their listeners are type-safe, and their simplicity makes this library's behavior easy to follow.

Unlike most other event systems we consider the job of collecting and managing a set of listeners, and the job of actually sending messages to those listeners to be separate concerns. Thus the library is separated into two logical parts:

- `Audience`: An object which is responsible for managing a collection of listeners via `.join`/`.part`.
- `emit`/`poll`: Independent functions which perform the actual job of emitting messages to all of the listeners.

## Example
```ts
// A generic mouse, with an arbitrary number of buttons. We omit the onRelease
// event for conciseness.
interface Mouse {
	// Interfaces define the events that they provide by including an Audience
	// typed property for every event.
	onPress: Audience<Spectator<(device: Mouse, button: number) => void>>;
	// The property name is irrelevant, but my convention is to use onEventName.
}

// A class implementing a simple two-button mouse.
class TwoButtonMouse implements Mouse {
	onPress = new Audience<
		Spectator<(device: TwoButtonMouse, button: 1 | 2) => void>
	>();
}

// Because the Mouse interface defines .onPress as an Audience, not an
// Audience.Iterable, users cannot emit events through it:
declare const mouse: Mouse;
emit(mouse.onPress, mouse, 5); // error

// However, since the Audience() constructor _does_ produce an Audience.Iterable
// user can emit events through it.
const mouse2 = new TwoButtonMouse();
emit(mouse2.onPress, mouse2, 1);

// It's less than ideal to let any user emit events through our class, and it
// makes sub-classing more difficult:
class FancyMouse extends TwoButtonMouse {
	// error: Property 'onPress' in type 'FancyMouse' is not assignable to the
	// same property in base type 'TwoButtonMouse'.
	onPress = new Audience<
		Spectator<(device: FancyMouse, button: 1 | 2) => void>
	>();
	onTilt = new Audience<
		Spectator<(device: FancyMouse, degrees: number) => void>
	>();
}

// To avoid these issues, I typically cast my constructor function to produce
// interfaces with non-iterable Audiences:
interface ThreeButtonMouse extends Mouse {
	onPress: Audience<Spectator<(device: this, button: 1 | 2 | 3) => void>>;
}
const ThreeButtonMouse: new () => ThreeButtonMouse = class ThreeButtonMouse
	implements Mouse {
	onPress = new Audience<
		Spectator<(device: this, button: 1 | 2 | 3) => void>
	>();
};

// Users with a ThreeButtonMouse cannot emit spurious events through .onPress:
const mouse3 = new ThreeButtonMouse();
emit(mouse3.onPress, mouse3, 1); // error

// And sub-classing is no longer an issue:
class MagicMouse extends ThreeButtonMouse {
	onPress = new Audience<
		Spectator<(device: MagicMouse, button: 1 | 2 | 3) => void>
	>();
	onScroll = new Audience<
		Spectator<
			(
				device: MagicMouse,
				scroll: {x: number; y: number},
			) => void
		>
	>();
}
// Note that users with a MagicMouse object _can_ emit spurious events on
// .onPress and .onScroll:
const magic = new MagicMouse();
emit(magic.onPress, magic, 1);
emit(magic.onScroll, magic, {x: 5, y: 0});
```

## Interfaces
This library will work with anything that implements the following interfaces. Object instance types are never checked.

### ※ Spectator\<F\> <a name="Spectator"></a>
**`interface Spectator<F extends (...args: any[]) => any>`**

A spectator is a handle object that can be `join`ed an `Audiences`. It has only one required property, `fn`, which is used as the callback function to receive messages.

- `F` – Function type used to receive messages.

_User-defined Properties_
- `fn` – Function callback that receives and responds to messages.

```ts
const spec: Spectator<(a: number, b: number) => void> & {
	record: [number, number][];
} = {
	fn(a, b) {
		this.record.push([ a, b ]);
	},
	record: [],
};
```

### ※ Audience\<Spec\> <a name="Audience"></a>
**`interface Audience<Spec extends Spectator<…>>`**

An `Audience` is a collection of [`Spectators`](#Spectator) that can receive messages of a particular type.

- `Spec` – Type of [`Spectator`](#Spectator) that are members of the Audience.

```ts
declare const audience: Audience<Spectator<(a: number, b: number) => void>>;
```

#### .join(spectator)
`.join<S extends Spec>(spectator: S): S`

Add a [`Spectator`](#Spectator) object to the Audience. If the `spectator` has already joined, the call has no effect.

Returns the _same object_ passed in via `spectator`.

- `S` – Some sub-type of `Spec`, users may add custom properties to the `spectator` object and access those properties via `this` inside of `fn`.
- `spectator` – The spectator object to add. May contain arbitrary user-defined properties.

```ts
const spec = audience.join({
	fn(a, b) {
		this.record.push([ a, b ]);
	},
	record: new Array<[number, number]>(),
});

audience.join(spec); // has no effect
```

#### .part(spectator)
`.part(spectator?: Spec | null | undefined): void`

Remove a [`Spectator`](#Spectator) object from the Audience. If the `spectator` has not already joined, the call has no effect.

- `spectator` – A spectator object to remove. Any object is permitted.

```ts
audience.part(spec);
audience.part(spec); // has no effect
```

#### .joined(spectator)
`.joined(spectator?: Spec | null | undefined): spectator as Spec`

Check if a particular [`Spectator`](#Spectator) has been added to the Audience. Also works as a type-guard, determining that an object is compatible with `Spec` if it already belongs to the Audience.

Returns true if the object is currently joined and false otherwise.

- `spectator` – A spectator object to check membership of. Any object is permitted.

```ts
declare spec: Spectator<(a: number, b: number) => void> | null;
if(audience.joined(spec)) {
	spec.fn(1, 1);
}
```

#### .dissolve()
`.dissolve(): void`

Dissolve the audience, removing all spectators and then resetting the Audience to its initial state.

```ts
const spec = audience.join({ fn() {} });
audience.dissolve();
audience.joined(spec); // false
```

### ※ Audience.Iterable\<Spec\> <a name="Iterable"></a>
**`interface Audience.Iterable<Spec extends Spectator<…>> extends Audience<Spec>`**

A collection of [`Spectators`](#Spectator) that exposes individual spectators through an iterator. Use this interface when you need to be able to [`emit`](#emit) or [`poll`](#poll) the audience.

Constructors implementing [`Audience`](#Audience) should return this type. Otherwise, incautious users of the constructor may pollute their own classes with implementation details and make inheritance tricky.

```ts
declare const iterableAudience: Iterable.Audience<
	Spectator<(a: number, b: number) => void>
>;
```

#### \[Symbol.iterator\]()
`[Symbol.iterator](): IterableIterator<Spec>`

Returns an iterator that is stable in the face of concurrent mutations:

- The iterator must not skip spectators if the underlying [`Audience`](#Audience) has mutated.
- The iterator must not return spectators that have parted unless they have rejoined.
- The iterator must not return the same spectator twice unless the spectator has since parted and then rejoined.

```ts
for(const spec of iterableAudience) {
	spec.fn(1, 1);
}
```

## Constructors
### ※ Audience\<Spec\>
**`new Audience<Spec extends Spectator<…>>(): Audience.Iterable<Spec>`**

A constructor for a `Set` based implementation of an [`Audience.Iterable`](#Iterable).

- `Spec` – Type of [`Spectator`](#Spectator) that are permitted to be members of the Audience.

```ts
const audience = new Audience<Spectator<() => void>>();
audience.join({ fn() { console.log("Hello World!") } });
emit(audience);
```

## Functions
This library exports two builtin ways to send messages to [`Audiences`](#Audience). Users of this library are free to implement their own variations on these two methods as need arises. These are primarily presented for example purposes.

### ※ emit(audience, ...message)
**`emit(audience: Audience.Iterable<Spec>, ...message: Msg): void`**

Emit a message to all of the [`Spectators`](#Spectator) in the selected [`Audience`](#Audience).

Optional properties on the Spectator objects control emit behavior:

- `once` – The spectator will be removed immediately after receiving the message.
- `dormant` – The spectator will not receive the message, nor will `once` be applied if it is set.

These optional properties do not need to be set. But [`Audiences`](#Audience) with conflicting spectator types will be incompatible with `emit`. See [`emit.Options`](#emit-Options).

- `audience` – The selected audience to send the message to. Must be an [`Audience.Iterable`](#Iterable).
- `...message` – Contents of the message to be emitted.

```ts
const audience = new Audience<
	Spectator<(a: number, b: number) => void> & emit.Options
>();

audience.join({
	fn(a, b) {
		console.log("A", a, b);
	},
});

// Will be removed after one message.
audience.join({
	fn() {
		console.log("B", a, b);
	},
	once: true,
});

emit(audience, 1, 2);
// "A" 1 2
// "B" 1 2

emit(audience, 3, 4);
// "A" 3 4
//         // B has been removed, and did not receive the message.
```

#### emit.Options <a name="emit-Options"></a>
`interface emit.Options`

A mixin for the [Spectator](#Spectator) interface that adds optional properties on every spectator which control how `emit` behaves when it emits messages to them.

Due to limitations of TypeScript, the global `.bind` method cannot bind the `emit` function safely. This library has provided overridden types for `emit.bind()` that _are_ type-safe.

_User-defined Properties_
- `once` – The spectator will be removed immediately after receiving the message.
- `dormant` – The spectator will not receive the message, nor will `once` be applied if it is set.

### ※ poll(audience, ...message)
**`emit(audience: Audience.Iterable<Spec>, ...message: Msg): Map<Spec, Result>`**

Poll an [`Audience`](#Audience) by sending a message to all of the [`Spectators`](#Spectator) in the audience and collecting their return values.

Optional properties on the Spectator objects control poll behavior:

- `once` – The spectator will be removed immediately after receiving the message.
- `dormant` – The spectator will not receive the message, nor will `once` be applied if it is set.

These optional properties do not need to be set. But [`Audiences`](#Audience) with conflicting spectator types will be incompatible with `poll`. See [`poll.Options`](#poll-Options).

Returns a Map from [`Spectators`](#Spectator) handles to their return values.

- `audience` – The selected audience to send the message to. Must be an [`Audience.Iterable`](#Iterable).
- `...message` – Contents of the message to be emitted.

```ts
const audience = new Audience<
	Spectator<(a: number, b: number) => number> & poll.Options
>();

const B = audience.join({
	fn(a, b) {
		return a * b;
	},
});

// Will be removed after one message.
const B = audience.join({
	fn() {
		return a * b * 2;
	},
	once: true,
});

poll(audience, 5, 6); // Map{[A, 30], [B, 60]}

poll(audience, 3, 4); // Map{[A, 12]}
// B has been removed, and did not receive the message.
```

#### poll.Options <a name="poll-Options"></a>
`interface poll.Options`

A mixin for the [Spectator](#Spectator) interface that adds optional properties on every spectator which control how `poll` behaves when it polls them.

Due to limitations of TypeScript, the global `.bind` method cannot bind the `poll` function safely. This library has provided overridden types for `poll.bind()` that _are_ type-safe.

_User-defined Properties_
- `once` – The spectator will be removed immediately after receiving the message.
- `dormant` – The spectator will not receive the message, nor will `once` be applied if it is set.
