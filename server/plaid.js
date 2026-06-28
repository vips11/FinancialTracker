const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid')

const plaidEnv = process.env.PLAID_ENV || 'development'
const secret = plaidEnv === 'sandbox' ? process.env.PLAID_SECRET_SANDBOX : process.env.PLAID_SECRET_DEVELOPMENT

const config = new Configuration({
  basePath: PlaidEnvironments[plaidEnv],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': secret,
    },
  },
})

module.exports = new PlaidApi(config)
