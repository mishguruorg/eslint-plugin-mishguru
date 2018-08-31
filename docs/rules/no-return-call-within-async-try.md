# Returning function calls within an async try/catch block. (no-return-call-within-async-try)

`async/await` can be really useful when you combine it with `try/catch` blocks
for error handling. If the promise rejects, then the catch block will be
executed.

```js
try {
  await somethingThatMayFail()
} catch (error) {
  // handle error
}
```

Sometimes though, you want to return a value inside the `try` clause.

If `somethingThatMayFail()` rejects, then the catch clause will execute. If it
resolves, then the value is returned.

```js
try {
  return await somethingThatMayFail()
} catch (error) {
  // handle error
}
```

However, if you omit the `await` keyword... then the code changes slightly. Now
the promise is returned - but it is NOT awaited for. 

This means that if `somethingThatMayFail` rejects, the catch clause will NOT be
executed.

```js
try {
  return somethingThatMayFail()
} catch (error) {
  // this will not be executed if the promise rejects
}
```

This ESLint rule will warn you if you return a function call inside a try
clause within an async function.

## Fixing this issue

```js
const fetch = async () => {
  try {
    return doSomethingAsync()
  } catch (error) {
    console.log(error)
  }
}
```

Just add the **await** keyword:

```js
const fetch = async () => {
  try {
    return await doSomethingAsync()
  } catch (error) {
    console.log(error)
  }
}
```

## Rule Details

Examples of **incorrect** code for this rule:

```js
async function fetchData () {
  try {
    return fetch(API_URL)
  } catch (error) {
    console.log('Could not fetch info')
  }
}

```

Examples of **correct** code for this rule:

```js
async function fetchData () {
  try {
    return await fetch(API_URL)
  } catch (error) {
    console.log('Could not fetch info')
  }
}
```
