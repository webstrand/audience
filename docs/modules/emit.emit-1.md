[@webstrand/audience](../README.md) / [Exports](../modules.md) / [emit](emit.md) / emit

# Namespace: emit

[emit](emit.md).emit

## Table of contents

### Interfaces

- [Options](../interfaces/emit.emit-1.options.md)

### Functions

- [bind](emit.emit-1.md#bind)

## Functions

### bind

▸ **bind**(`thisArg`: *unknown*): *typeof* [*emit*](emit.md#emit)

#### Parameters:

Name | Type |
:------ | :------ |
`thisArg` | *unknown* |

**Returns:** *typeof* [*emit*](emit.md#emit)

Defined in: [emit.ts:50](https://github.com/webstrand/audience/blob/25e4ffb/src/emit.ts#L50)

▸ **bind**<Msg, Rem\>(`thisArg`: *unknown*, `audience`: [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: [...Msg, ...Rem]) => *unknown*\> & [*Options*](../interfaces/emit.emit-1.options.md)\>, ...`msg`: Msg): (...`msg`: Rem) => *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`Msg` | readonly *unknown*[] |
`Rem` | readonly *unknown*[] |

#### Parameters:

Name | Type |
:------ | :------ |
`thisArg` | *unknown* |
`audience` | [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: [...Msg, ...Rem]) => *unknown*\> & [*Options*](../interfaces/emit.emit-1.options.md)\> |
`...msg` | Msg |

**Returns:** *function*

Defined in: [emit.ts:51](https://github.com/webstrand/audience/blob/25e4ffb/src/emit.ts#L51)
