const useDaily = process.env.USE_DAILY;
const OpenTok =
  useDaily === 'TRUE' ? require('daily-opentok-node') : require('opentok');

exports.handler = async function handler(event) {
  const gotSessionID = event.queryStringParameters.sessionID;

  // In the case of our default Vonage flow, the OpenTok instance
  // will be created by passing in Vonage API key and secret
  let initParam1 = process.env.VONAGE_API_KEY;
  let initParam2 = process.env.VONAGE_API_SECRET;

  // In case of Daily provider flow, the OpenTok instance
  // will be created by passing in empty string and
  // Daily API key. The second parameter CAN also be
  // a pre-fetched Daily Domain ID if desired.
  if (useDaily === 'TRUE') {
    initParam1 = process.env.DAILY_API_KEY;
    initParam2 = '';
  }
  const ot = new OpenTok(initParam1, initParam2);

  // Instantiate options with which to generate token
  const opts = {};

  // Provide Daily domain ID (used for self-signed token generation)
  if (useDaily === 'TRUE') {
    const domainID = await ot.getDomainID();
    opts.domainID = domainID;
  }

  const token = ot.generateToken(gotSessionID, opts);
  return {
    statusCode: 200,
    body: token,
  };
};
