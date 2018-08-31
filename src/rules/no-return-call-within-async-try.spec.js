import test from 'ava'
import RuleTester from 'eslint-ava-rule-tester'

import rule from './no-return-call-within-async-try'

const ruleTester = new RuleTester(test, {
  parser: 'babel-eslint'
})

const ERRORS = [
  {
    message: 'Do not return a function call inside an async try/catch block.',
    type: 'ReturnStatement'
  }
]

ruleTester.run('no-return-call-within-async-try', rule, {
  valid: [
    `
async function fn () {
  try {
    return await promise()
  } catch (error) {
    return handleError(error)
  }
}
`,
    `
async function fn () {
  try {
    const inner = () => {
      return promise()
    }
  } catch (error) {
    return handleError(error)
  } finally {
    return resolve()
  }
}
`
  ],
  invalid: [
    {
      code: `
async function fn () {
  try {
    return promise()
  } catch (error) {
    console.log(error)
  }
}
`,
      errors: ERRORS
    },
    {
      code: `
function fn () {
  const inner = async () => {
    try {
      return promise()
    } catch (error) {
      console.log(error)
    }
  }
}
`,
      errors: ERRORS
    }
  ]
})
