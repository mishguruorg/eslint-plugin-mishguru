const allRules = {
  'no-return-call-within-async-try': require('./rules/no-return-call-within-async-try')
    .default
}

function configureAsError(rules) {
  const result = {}
  for (const key of Object.keys(rules)) {
    result[`mishguru/${key}`] = 2
  }
  return result
}

const allRulesConfig = configureAsError(allRules)

module.exports = {
  rules: allRules,
  configs: {
    recommended: {
      rules: {
        'mishguru/no-return-call-within-async-try': 2
      }
    },
    all: {
      rules: allRulesConfig
    }
  }
}
