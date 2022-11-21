# Daily OpenTok Shim conversion demo

This demo showcases how developers can use Daily's OpenTok client and server-side shims to start porting their existing OpenTok application to Daily. 

The client-side version of this demo is loosely based on Vonage's [Basic web client walkthrough](https://tokbox.com/developer/tutorials/web/basic-video-chat/), in which the user builds a [Basic Video Chat demo](https://github.com/opentok/opentok-web-samples/tree/main/Basic%20Video%20Chat). It uses [daily-opentok-client](LINK) to replace the OpenTok implementation with Daily without changing any other client code.

The demo also uses our [daily-opentok-node](LINK) shim to create sessions (known as "rooms" in Daily) and access tokens to be used by the client. This contains minimal code changes to account for which API credentials to pass into the `OpenTok` constructor: Daily's or Vonage's.

![Screenshot of demo app](screenshot.png)