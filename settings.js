var Settings = {
  pg:   {
    url     : ''//'tcp://'+settings.PG_USER+':'+settings.PG_PASSW+'@'+settings.PG_HOST+'/'+settings.PG_DATABASE
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
