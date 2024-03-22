## NATS Publish/Subscribe communication example (TS)

#### Build:

```
npm run build
```

#### Run subscriber:

```bash
npm run subscriber -- -s nats://127.0.0.1:4222 -max 20 notif
#or
node ./build/subscriber.js -- -s nats://127.0.0.1:4222 -max 20 notif
```


#### Run publisher:

```bash
npm run publisher -- -s nats://127.0.0.1:4222 -count 3 notif hello
#or
node ./build/publisher.js -s nats://127.0.0.1:4222 -count 2 notif hello
```