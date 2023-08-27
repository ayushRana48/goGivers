// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { GroupsModel, UsersModel, Invite, User } = initSchema(schema);

export {
  GroupsModel,
  UsersModel,
  Invite,
  User
};