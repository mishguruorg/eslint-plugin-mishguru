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

        // must be inside a try statement
        const tryStatementIndex = ancestors.findIndex((n) => {
          return n.type === 'TryStatement'
        })
        if (tryStatementIndex < 0) {
          return
        }
        const tryStatement = ancestors[tryStatementIndex]
        ancestors.splice(0, tryStatementIndex + 1)

        // ignore catch clause
        const catchClauseIndex = ancestors.findIndex((n) => {
          return n.type === 'CatchClause'
        })
        if (catchClauseIndex > -1) {
          return
        }

        // ignore finally call
        if (ancestors[0] === tryStatement.finalizer) {
          return
        }

        // must be part of a return statement
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
