# eslint-plugin-mishguru

## Rules

[`no-return-call-within-async-try`](./docs/rules/no-return-call-within-async-try.md)

```js
const fetch = async () => {
  try {
    return doSomethingAsync() // <-- this should be awaited
  } catch (error) {
    console.log(error) // <-- this doesn't run if doSomethingAsync fails
  }
}
```
