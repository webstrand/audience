[@webstrand/audience](../README.md) / [Exports](../modules.md) / [poll](poll.md) / poll

# Namespace: poll

[poll](poll.md).poll

## Table of contents

### Interfaces

- [Options](../interfaces/poll.poll-1.options.md)

### Functions

- [bind](poll.poll-1.md#bind)

## Functions

### bind

▸ **bind**<Msg, Rem, Ret, Spec\>(`thisArg`: *unknown*, `audience`: [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: [...Msg, ...Rem]) => Ret\> & Spec\>, ...`msg`: Msg): (...`msg`: Rem) => *Map*<Spec, Ret\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Msg` | readonly *unknown*[] |
`Rem` | readonly *unknown*[] |
`Ret` | - |
`Spec` | [*Spectator*](../interfaces/index.spectator.md)<(...`msg`: *never*) => *unknown*, Spec\> & [*Options*](../interfaces/poll.poll-1.options.md) |

#### Parameters:

Name | Type |
:------ | :------ |
`thisArg` | *unknown* |
`audience` | [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: [...Msg, ...Rem]) => Ret\> & Spec\> |
`...msg` | Msg |

**Returns:** *function*

Defined in: [poll.ts:54](https://github.com/webstrand/audience/blob/25e4ffb/src/poll.ts#L54)

▸ **bind**(`thisArg`: *unknown*): *typeof* [*poll*](poll.md#poll)

#### Parameters:

Name | Type |
:------ | :------ |
`thisArg` | *unknown* |

**Returns:** *typeof* [*poll*](poll.md#poll)

Defined in: [poll.ts:55](https://github.com/webstrand/audience/blob/25e4ffb/src/poll.ts#L55)
