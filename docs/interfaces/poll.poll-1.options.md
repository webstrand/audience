[@webstrand/audience](../README.md) / [Exports](../modules.md) / [poll](../modules/poll.md) / [poll](../modules/poll.poll-1.md) / Options

# Interface: Options

[poll](../modules/poll.md).[poll](../modules/poll.poll-1.md).Options

A mixin for the [Spectator](index.spectator.md) interface that adds optional properties on
every spectator which control how [poll](../modules/poll.poll-1.md) behaves when it polls them.

## Table of contents

### Properties

- [dormant](poll.poll-1.options.md#dormant)
- [once](poll.poll-1.options.md#once)

## Properties

### dormant

• `Optional` **dormant**: *undefined* \| *boolean*

The spectator will not receive the message, nor will `once` be
applied if it is set.

Defined in: [poll.ts:51](https://github.com/webstrand/audience/blob/e2540cb/src/poll.ts#L51)

___

### once

• `Optional` **once**: *undefined* \| *boolean*

The spectator will be removed immediately after receiving the
message.

Defined in: [poll.ts:45](https://github.com/webstrand/audience/blob/e2540cb/src/poll.ts#L45)
