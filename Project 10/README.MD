## NATS Publish/Subscribe with Protobuf (with protobufjs) simple example

NATS message payloads are byte slices, so any kind of serialization strategy can be applied. This example shows a simple way to define message types using the Protocol Buffers IDL, generate code for the target language, and then use it with NATS.

#### Setup:

```
npm i nats
npm i protobufjs
```

#### Start:

```
npm run subscriber
npm run publisher
```
