
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
var i = 0;
while(i < process.argv.length)
{
  if(process.argv[i] == '-aws.id')
  {
    Settings.amazon.awsId = process.argv[i+1];
  }
  else if(process.argv[i] == '-aws.key')
  {
    Settings.amazon.awsSecret = process.argv[i+1];
  }
  else if(process.argv[i] == '-aws.tag')
  {
    Settings.amazon.assocId = process.argv[i+1];
  }
  i++;
}

module.exports = Settings;
