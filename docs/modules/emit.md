[@webstrand/audience](../README.md) / [Exports](../modules.md) / emit

# Module: emit

## Table of contents

### Namespaces

- [emit](emit.emit-1.md)

### Functions

- [emit](emit.md#emit)

## Functions

### emit

▸ **emit**<Msg\>(`audience`: [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: Msg) => *unknown*\> & [*Options*](../interfaces/emit.emit-1.options.md)\>, ...`msg`: Msg): *void*

Emit a message to all of the [Spectators](../interfaces/index.spectator.md) in the selected
[Audience](index.md#audience).

Optional properties on the Spectator objects control emit behavior:

- `once` – The spectator will be removed immediately after receiving the
  message.
- `dormant` – The spectator will not receive the message, nor will `once` be
  applied if it is set.

These optional properties do not need to be set. But [Audiences](index.md#audience)
with conflicting spectator types will be incompatible with `emit`. See
[emit.Options](../interfaces/emit.emit-1.options.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`Msg` | readonly *unknown*[] |

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`audience` | [*Iterable*](../interfaces/index.audience.iterable.md)<[*Spectator*](../interfaces/index.spectator.md)<(...`msg`: Msg) => *unknown*\> & [*Options*](../interfaces/emit.emit-1.options.md)\> | The selected audience to send the message to. Must be an [Audience.Iterable](../interfaces/index.audience.iterable.md).   |
`...msg` | Msg | Contents of the message to be emitted.    |

**Returns:** *void*

Defined in: [emit.ts:22](https://github.com/webstrand/audience/blob/e2540cb/src/emit.ts#L22)
