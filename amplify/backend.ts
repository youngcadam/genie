import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { task } from './functions/task/resource';

defineBackend({
  auth,
  data,
  function: task,
});
