## NATS Request/Reply communication example (TS)

#### Build:

```
npm run build
```

#### Run service:

```bash
npm run service -- -s nats://127.0.0.1:4222 notif alloha
#or
node ./build/service.js -- -s nats://127.0.0.1:4222 notif alloha
```

#### Run client:

```bash
npm run client -- -s nats://127.0.0.1:4222 notif hello
#or
node ./build/client.js -s nats://127.0.0.1:4222 notif hello
```
