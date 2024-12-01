import { defineFunction } from '@aws-amplify/backend';

export const task = defineFunction({
  name: 'task',
  entry: './handler.ts',
  environment: {
    QUEUE_URL: 'https://sqs.us-west-2.amazonaws.com/808506583653/image-generation',
  }
});
