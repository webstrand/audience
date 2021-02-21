[@webstrand/audience](../README.md) / [Exports](../modules.md) / [emit](../modules/emit.md) / [emit](../modules/emit.emit-1.md) / Options

# Interface: Options

[emit](../modules/emit.md).[emit](../modules/emit.emit-1.md).Options

A mixin for the [Spectator](index.spectator.md) interface that adds optional properties on
every spectator which control how `emit` behaves when it emits messages
to them.

## Table of contents

### Properties

- [dormant](emit.emit-1.options.md#dormant)
- [once](emit.emit-1.options.md#once)

## Properties

### dormant

• `Optional` **dormant**: *undefined* \| *boolean*

The spectator will not receive the message, nor will `once` be
applied if it is set.

Defined in: [emit.ts:47](https://github.com/webstrand/audience/blob/25e4ffb/src/emit.ts#L47)

___

### once

• `Optional` **once**: *undefined* \| *boolean*

The spectator will be removed immediately after receiving the
message.

Defined in: [emit.ts:41](https://github.com/webstrand/audience/blob/25e4ffb/src/emit.ts#L41)
