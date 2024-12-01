import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Task: a
    .model({
      positivePrompt: a.string(),
      negativePrompt: a.string(),
      steps: a.integer(),
      width: a.integer(),
      height: a.integer(),
      sampler: a.string(),
      seed: a.string(),
      cfgScale: a.float(),
      batchSize: a.integer(),
      status: a.string().default("pending"),
      imageKey: a.string(),
      createdAt: a.timestamp().default(() => Math.floor(Date.now() / 1000)), // Corrected default value
      updatedAt: a.timestamp(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  taskQuery: a
    .query()
    .arguments({
      positivePrompt: a.string(),
      negativePrompt: a.string(),
      steps: a.integer(),
      width: a.integer(),
      height: a.integer(),
      sampler: a.string(),
      seed: a.string(),
      cfgScale: a.float(),
      batchSize: a.integer(),
      imageKey: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function("task"))
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
