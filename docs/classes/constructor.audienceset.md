[@webstrand/audience](../README.md) / [Exports](../modules.md) / [constructor](../modules/constructor.md) / AudienceSet

# Class: AudienceSet<Spec\>

[constructor](../modules/constructor.md).AudienceSet

Set-based implementation of `Audience.Iterable`. Users should not normally
construct instance of this class directly because it can cause issues with
inheritance if the natural type is exposed. Users should instead use the
Audience constructor exported by index

## Type parameters

Name | Type |
:------ | :------ |
`Spec` | [*Spectator*](../interfaces/index.spectator.md)<(...`msg`: *never*) => *unknown*\> |

## Implements

* [*Iterable*](../interfaces/index.audience.iterable.md)<Spec\>

## Table of contents

### Constructors

- [constructor](constructor.audienceset.md#constructor)

### Properties

- [members](constructor.audienceset.md#members)

### Methods

- [[Symbol.iterator]](constructor.audienceset.md#[symbol.iterator])
- [dissolve](constructor.audienceset.md#dissolve)
- [join](constructor.audienceset.md#join)
- [joined](constructor.audienceset.md#joined)
- [part](constructor.audienceset.md#part)

## Constructors

### constructor

\+ **new AudienceSet**<Spec\>(): [*AudienceSet*](constructor.audienceset.md)<Spec\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Spec` | [*Spectator*](../interfaces/index.spectator.md)<(...`msg`: *never*) => *unknown*, Spec\> |

**Returns:** [*AudienceSet*](constructor.audienceset.md)<Spec\>

## Properties

### members

• **members**: *Set*<Readonly<Spec\>\>

Defined in: [constructor.ts:10](https://github.com/webstrand/audience/blob/942ad64/src/constructor.ts#L10)

## Methods

### [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator*<Readonly<Spec\>\>

Returns an iterator that is stable in the face of concurrent
mutations:

- The iterator must not skip spectators if the underlying
  [Audience](../modules/index.md#audience) has mutated.
- The iterator must not return spectators that have parted unless
  they have rejoined.
- The iterator must not return the same spectator twice unless the
  spectator has since parted and then rejoined.

**Returns:** *IterableIterator*<Readonly<Spec\>\>

Implementation of: [Iterable](../interfaces/index.audience.iterable.md)

Defined in: [constructor.ts:32](https://github.com/webstrand/audience/blob/942ad64/src/constructor.ts#L32)

___

### dissolve

▸ **dissolve**(): *void*

Dissolve the audience, removing all spectators and then resetting the
Audience to its initial state.

**Returns:** *void*

Implementation of: [Iterable](../interfaces/index.audience.iterable.md)

Defined in: [constructor.ts:28](https://github.com/webstrand/audience/blob/942ad64/src/constructor.ts#L28)

___

### join

▸ **join**<S\>(`spectator`: S & Spec): S & Spec

#### Type parameters:

Name |
:------ |
`S` |

#### Parameters:

Name | Type |
:------ | :------ |
`spectator` | S & Spec |

**Returns:** S & Spec

Defined in: [constructor.ts:12](https://github.com/webstrand/audience/blob/942ad64/src/constructor.ts#L12)

___

### joined

▸ **joined**<S\>(`spectator`: *undefined* \| *null* \| S): spectator is S

#### Type parameters:

Name | Type |
:------ | :------ |
`S` | *Readonly*<Spec\> |

#### Parameters:

Name | Type |
:------ | :------ |
`spectator` | *undefined* \| *null* \| S |

**Returns:** spectator is S

Defined in: [constructor.ts:23](https://github.com/webstrand/audience/blob/942ad64/src/constructor.ts#L23)

___

### part

▸ **part**<S\>(`spectator`: *undefined* \| *null* \| S): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`S` | *Readonly*<Spec\> |

#### Parameters:

Name | Type |
:------ | :------ |
`spectator` | *undefined* \| *null* \| S |

**Returns:** *void*

Defined in: [constructor.ts:17](https://github.com/webstrand/audience/blob/942ad64/src/constructor.ts#L17)
