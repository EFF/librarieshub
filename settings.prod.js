var Settings = {
  pg:   {
    url   : process.env.POSTGRESQL
  },
  amazon: {
    awsId     : process.env.AWSID, // your AWS API key
    awsSecret : process.env.AWSSECRET, // api secret
    assocId   : process.env.ASSOCID,  // associate tag
    endPoint  : 'ecs.amazonaws.ca'
  },
  port: process.env.PORT,
  headers: { // additionnal headers
    
  }
}
module.exports = Settings;
