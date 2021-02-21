[@webstrand/audience](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / Spectator

# Interface: Spectator<F\>

[index](../modules/index.md).Spectator

A spectator is a handle object that can be `join`ed an `Audiences`. It has
only one required property, `fn`, which is used as the callback function to
receive messages.

## Type parameters

Name | Type | Description |
:------ | :------ | :------ |
`F` | (...`msg`: *never*) => *unknown* | Function type used to receive messages.    |

## Table of contents

### Properties

- [fn](index.spectator.md#fn)

## Properties

### fn

• **fn**: F

Function callback that receives and responds to messages.

Defined in: [index.ts:31](https://github.com/webstrand/audience/blob/e2540cb/src/index.ts#L31)
