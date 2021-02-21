[@webstrand/audience](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / [Audience](../modules/index.audience.md) / Iterable

# Interface: Iterable<Spec\>

[index](../modules/index.md).[Audience](../modules/index.audience.md).Iterable

A collection of [Spectator](index.spectator.md) that exposes individual spectators through
an iterator. Use this interface when you need to be able to [emit](../modules/index.md#emit) or
[poll](../modules/index.md#poll) the audience.

Constructors implementing [Audience](../modules/index.audience.md) should return this type.
Otherwise, incautious users of the constructor may pollute their own
classes with implementation details and make inheritance tricky.

## Type parameters

Name | Type |
:------ | :------ |
`Spec` | [*Spectator*](index.spectator.md)<(...`msg`: *never*) => *unknown*\> |

## Hierarchy

* [*Audience*](../modules/index.md#audience)<Spec\>

  ↳ **Iterable**

## Implemented by

* [*AudienceSet*](../classes/constructor.audienceset.md)

## Table of contents

### Methods

- [[Symbol.iterator]](index.audience.iterable.md#[symbol.iterator])
- [dissolve](index.audience.iterable.md#dissolve)
- [join](index.audience.iterable.md#join)
- [joined](index.audience.iterable.md#joined)
- [part](index.audience.iterable.md#part)

## Methods

### [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator*<Readonly<Spec\>\>

Returns an iterator that is stable in the face of concurrent
mutations:

- The iterator must not skip spectators if the underlying
  [Audience](../modules/index.audience.md) has mutated.
- The iterator must not return spectators that have parted unless
  they have rejoined.
- The iterator must not return the same spectator twice unless the
  spectator has since parted and then rejoined.

**Returns:** *IterableIterator*<Readonly<Spec\>\>

Defined in: [index.ts:106](https://github.com/webstrand/audience/blob/25e4ffb/src/index.ts#L106)

___

### dissolve

▸ **dissolve**(): *void*

Dissolve the audience, removing all spectators and then resetting the
Audience to its initial state.

**Returns:** *void*

Defined in: [index.ts:81](https://github.com/webstrand/audience/blob/25e4ffb/src/index.ts#L81)

___

### join

▸ `Private`**join**<S\>(`spectator`: S & Spec): S & Spec

Add a [Spectator](index.spectator.md) object to the Audience. If the `spectator` has
already joined, the call has no effect.

#### Type parameters:

Name | Description |
:------ | :------ |
`S` | Some sub-type of `Spec`, users may add custom properties to the `spectator` object and access those properties via `this` inside of `fn`.   |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`spectator` | S & Spec | The spectator object to add. May contain arbitrary user-defined properties.    |

**Returns:** S & Spec

The spectator object that was passed in.

Defined in: [index.ts:53](https://github.com/webstrand/audience/blob/25e4ffb/src/index.ts#L53)

▸ `Private`**join**(`spectator`: Spec): *unknown*

#### Parameters:

Name | Type |
:------ | :------ |
`spectator` | Spec |

**Returns:** *unknown*

Defined in: [index.ts:55](https://github.com/webstrand/audience/blob/25e4ffb/src/index.ts#L55)

___

### joined

▸ **joined**<S\>(`spectator`: *undefined* \| *null* \| S): spectator is S

Check if a particular [Spectator](index.spectator.md) has been added to the Audience. Also
works as a type-guard, determining that an object is compatible with
`Spec` if it already belongs to the Audience.

#### Type parameters:

Name | Type |
:------ | :------ |
`S` | *Readonly*<Spec\> |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`spectator` | *undefined* \| *null* \| S | A spectator object to check membership of. Any object is permitted.    |

**Returns:** spectator is S

true if the object is currently joined and false otherwise.

Defined in: [index.ts:75](https://github.com/webstrand/audience/blob/25e4ffb/src/index.ts#L75)

___

### part

▸ **part**<S\>(`spectator`: *undefined* \| *null* \| S): *void*

Remove a [Spectator](index.spectator.md) object from the Audience. If the `spectator` has
not already joined, the call has no effect.

#### Type parameters:

Name | Type |
:------ | :------ |
`S` | *Readonly*<Spec\> |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`spectator` | *undefined* \| *null* \| S | A spectator object to remove. Any object is permitted.    |

**Returns:** *void*

Defined in: [index.ts:63](https://github.com/webstrand/audience/blob/25e4ffb/src/index.ts#L63)
