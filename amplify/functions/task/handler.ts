import { SQS } from 'aws-sdk';
import type { APIGatewayProxyHandler } from 'aws-lambda';

const sqs = new SQS();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { positivePrompt, negativePrompt, steps, width, height, sampler, seed, cfgScale, batchSize, imageKey } = body;

    const queueUrl = process.env.QUEUE_URL;
    if (!queueUrl) {
      throw new Error('QUEUE_URL environment variable is not set.');
    }

    const message = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        positivePrompt,
        negativePrompt,
        steps,
        width,
        height,
        sampler,
        seed,
        cfgScale,
        batchSize,
        imageKey,
      }),
    };

    await sqs.sendMessage(message).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Task submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Failed to submit task.' }),
    };
  }
};
