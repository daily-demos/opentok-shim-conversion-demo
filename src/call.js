// Vonage API key can be public. Secret cannot.
// https://stackoverflow.com/questions/60064861/opentok-toxbox-keep-the-api-key-secret
// When using Daily's OpenTok shim,
// the API key is not used and can be set to anything.
const apiKey = '47542751';

main();

function main() {
  // Retrieve any parameters passed in the URL
  const usp = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(usp.entries());

  // Either join requested session or get a new one
  if (params.sessionID) {
    joinSession(params.sessionID);
    return;
  }
  startNewSession();
}

// joinSession() joins the given session ID
// The equivalent of OpenTok session's in Daily are "rooms"
function joinSession(sessionID) {
  initializeSession(sessionID);
}

// startNewSession() creates a new session (or "room", in case of Daily)
// and then joins it
function startNewSession() {
  createSession().then((sessionID) => {
    initializeSession(sessionID);
  });
}

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    console.error(error.message);
    alert(error.message);
  }
}

// createSession() creates a new Session (or "room", in case of Daily)
async function createSession() {
  const url = '/.netlify/functions/session';

  const errMsg = 'failed to create session';

  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      throw new Error(`${errMsg}. Status code: ${res.status}`);
    }
    const data = await res.text();
    return data;
  } catch (e) {
    throw new Error(`${errMsg}: ${e.toString()}`);
  }
}

// getToken() retrieves an access token for the given session ID
async function getToken(sessionID) {
  const url = `/.netlify/functions/token?sessionID=${sessionID}`;
  const errMsg = 'failed to get token';
  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      throw new Error(`${errMsg}. Status code: ${res.status}`);
    }
    const data = await res.text();
    return data;
  } catch (e) {
    throw new Error(`${errMsg}: ${e.toString()}`);
  }
}

// initializeSession() initializes the requested session
// and retrieves an access token for it.s
async function initializeSession(sessionID) {
  const session = OT.initSession(apiKey, sessionID);
  const token = await getToken(sessionID);

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    session.subscribe(
      event.stream,
      'subscriber',
      {
        insertMode: 'append',
        width: '100%',
        height: '100%',
      },
      handleError
    );
  });

  // Create a publisher
  const publisher = OT.initPublisher(
    'publisher',
    {
      insertMode: 'append',
      width: '100%',
      height: '100%',
    },
    handleError
  );

  // Connect to the session
  session.connect(token, (error) => {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });

  const info = document.getElementById('sessionInfo');
  info.innerText = sessionID;
}
