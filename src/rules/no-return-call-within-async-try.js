const rule = {
  meta: {
    docs: {
      category: 'Possible Errors',
      description:
        'Prevent returning a function call within an async try/catch block.',
      recommended: true
    },
    fixable: null,
    schema: []
  },

  create(context) {
    return {
      CallExpression(node) {
        const scope = context.getScope()
        const parentFunction = scope.variableScope.block

        if (parentFunction.async !== true) {
          return
        }

        const ancestors = context.getAncestors()
        const parentFunctionIndex = ancestors.indexOf(parentFunction)
        ancestors.splice(0, parentFunctionIndex + 1)

        const tryStatementIndex = ancestors.findIndex((n) => {
          return n.type === 'TryStatement'
        })
        if (tryStatementIndex < 0) {
          return
        }
        ancestors.splice(0, tryStatementIndex + 1)

        const returnStatementIndex = ancestors.findIndex((n) => {
          return n.type === 'ReturnStatement'
        })
        if (returnStatementIndex < 0) {
          return
        }
        const returnStatement = ancestors[returnStatementIndex]
        ancestors.splice(0, returnStatementIndex + 1)

        // ignore "return await call()"
        const awaitExpressionIndex = ancestors.findIndex((n) => {
          return n.type === 'AwaitExpression'
        })
        if (awaitExpressionIndex > -1) {
          return
        }

        context.report(
          returnStatement,
          'Do not return a function call inside an async try/catch block.'
        )
      }
    }
  }
}

export default rule
