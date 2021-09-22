import nats, { Stan } from 'node-nats-streaming';

// mock
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: String, data: String, callback: () => void) => {
          callback();
        }
      ),
  },
};
