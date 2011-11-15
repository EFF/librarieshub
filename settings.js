var Settings = {
  pg:   {
    url     : 'tcp://postgres:postgres@ec2-107-22-160-15.compute-1.amazonaws.com/librarieshub_pg'
  },
  amazon: {
    awsId     : process.env.AWSID, // your AWS API key
    awsSecret : process.env.AWSSECRET, // api secret
    assocId   : process.env.ASSOCID  // associate tag
  },
  headers: { // additionnal headers
    'Access-Control-Allow-Origin': '*'
  }
};
module.exports = Settings;
