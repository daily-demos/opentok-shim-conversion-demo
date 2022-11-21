const OpenTok = require("daily-opentok-node");
//const OpenTok = require("opentok");

exports.handler = async function(event, context) {
    // In the case of our default Vonage flow, the OpenTok instance
    // will be created by passing in Vonage API key and secret
    let initParam1 = process.env.VONAGE_API_KEY;
    let initParam2 = process.env.VONAGE_API_SECRET;

    // In case of Daily provider flow, the OpenTok instance
    // will be created by passing in a Daily API Key
    // and empty string.
    const useDaily = process.env.USE_DAILY;
    if (useDaily === "TRUE") {
        initParam1 = process.env.DAILY_API_KEY;
        initParam2 = "";
    }
    console.log("USE_DAILY", useDaily, initParam1, initParam2)
    const ot = new OpenTok(initParam1, initParam2);
    let session;

    try {
        session = await new Promise((resolve, reject) => {
            ot.createSession({ mediaMode: 'relayed' }, (error, session) => {
                if (error) {
                    return reject(error)
                }
                resolve(session);
            })
        })
    } catch (e) {
        console.error("Error creating session:", e);
        return {
            statusCode: 500,
            body: e
        };
    }
    return {
        statusCode: 200,
        body: session.sessionId
    };
}