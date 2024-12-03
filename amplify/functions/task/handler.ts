import { SQS } from 'aws-sdk';

const sqs = new SQS();

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // Extract arguments from the event
    const {
      positivePrompt,
      negativePrompt,
      steps,
      width,
      height,
      sampler,
      seed,
      cfgScale,
      batchSize,
      imageKey
    } = event.arguments || {};

    // Ensure all required fields are present
    if (!positivePrompt || !steps || !width || !height || !sampler || !cfgScale || !batchSize || !imageKey) {
      throw new Error("Missing required arguments.");
    }

    const queueUrl = process.env.QUEUE_URL;
    if (!queueUrl) {
      throw new Error("QUEUE_URL environment variable is not set.");
    }

    // Construct the SQS message
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
        imageKey
      }),
    };

    console.log("Message to send to SQS:", message);

    // Send the message to SQS
    await sqs.sendMessage(message).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Task submitted successfully!' }),
    };
  } catch (error) {
    console.error("Error in Lambda function:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Failed to submit task.', details: error.message }),
    };
  }
};
