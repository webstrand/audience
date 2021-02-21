[@webstrand/audience](../README.md) / [Exports](../modules.md) / poll

# Module: poll

## Table of contents

### Namespaces

- [poll](poll.poll-1.md)

### Functions

- [poll](poll.md#poll)

## Functions

### poll

▸ **poll**<Msg, Ret, Spec\>(`audience`: [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: Msg) => Ret\> & Spec\>, ...`msg`: Msg): *Map*<Spec, Ret\>

Poll an [Audience](index.md#audience) by sending a message to all of the
[Spectators](../interfaces/index.spectator.md) in the audience and collecting their return values.

Optional properties on the Spectator objects control poll behavior:

- `once` – The spectator will be removed immediately after receiving the
  message.
- `dormant` – The spectator will not receive the message, nor will `once` be
  applied if it is set.

These optional properties do not need to be set. But [Audiences](index.md#audience)
with conflicting spectator types will be incompatible with `poll`. See
[poll.Options](../interfaces/poll.poll-1.options.md).

Returns a `Map` from [Spectator](../interfaces/index.spectator.md) handles to their return values.

#### Type parameters:

Name | Type |
:------ | :------ |
`Msg` | readonly *unknown*[] |
`Ret` | - |
`Spec` | [*Spectator*](../interfaces/index.spectator.md)<(...`args`: *never*) => *unknown*, Spec\> & [*Options*](../interfaces/poll.poll-1.options.md) |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`audience` | [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: Msg) => Ret\> & Spec\> | The selected audience to send the message to. Must be an [Audience.Iterable](../interfaces/index.audience.iterable.md).   |
`...msg` | Msg | - |

**Returns:** *Map*<Spec, Ret\>

Defined in: [poll.ts:24](https://github.com/webstrand/audience/blob/942ad64/src/poll.ts#L24)
