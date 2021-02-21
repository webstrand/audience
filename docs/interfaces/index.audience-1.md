[@webstrand/audience](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / Audience

# Interface: Audience<Spec\>

[index](../modules/index.md).Audience

## Type parameters

Name | Type |
:------ | :------ |
`Spec` | [*Spectator*](index.spectator.md)<(...`msg`: *never*) => *unknown*\> |

## Table of contents

### Methods

- [dissolve](index.audience-1.md#dissolve)
- [join](index.audience-1.md#join)
- [joined](index.audience-1.md#joined)
- [part](index.audience-1.md#part)

## Methods

### dissolve

▸ **dissolve**(): *void*

Dissolve the audience, removing all spectators and then resetting the
Audience to its initial state.

**Returns:** *void*

Defined in: [index.ts:81](https://github.com/webstrand/audience/blob/942ad64/src/index.ts#L81)

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

Defined in: [index.ts:53](https://github.com/webstrand/audience/blob/942ad64/src/index.ts#L53)

▸ `Private`**join**(`spectator`: Spec): *unknown*

#### Parameters:

Name | Type |
:------ | :------ |
`spectator` | Spec |

**Returns:** *unknown*

Defined in: [index.ts:55](https://github.com/webstrand/audience/blob/942ad64/src/index.ts#L55)

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

Defined in: [index.ts:75](https://github.com/webstrand/audience/blob/942ad64/src/index.ts#L75)

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

Defined in: [index.ts:63](https://github.com/webstrand/audience/blob/942ad64/src/index.ts#L63)
