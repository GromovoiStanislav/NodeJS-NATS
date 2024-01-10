import { connect } from 'nats';

export class NatsAgent {
  constructor() {}

  async initializeAgent({ servers = ['0.0.0.0:4222'] } = {}) {
    try {
      this.agent = await connect({
        servers: servers.map((host) => `nats://${host}`),
        timeout: 10 * 1000, // 10s
        maxReconnectAttempts: 10,
      });
    } catch (error) {
      console.error(`${this.constructor.name} initialization error:`, error);
    }
  }

  async request(subject, payload) {
    const response = await this.agent.request(subject, JSON.stringify(payload));
    return response;
  }

  subscribe(subject, cb) {
    return this.agent.subscribe(subject);
  }

  publish(subject, payload) {
    this.agent.publish(subject, JSON.stringify(payload));
  }
}
