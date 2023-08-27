import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerInvite = {
  readonly sender?: string | null;
  readonly groupId?: string | null;
}

type LazyInvite = {
  readonly sender?: string | null;
  readonly groupId?: string | null;
}

export declare type Invite = LazyLoading extends LazyLoadingDisabled ? EagerInvite : LazyInvite

export declare const Invite: (new (init: ModelInit<Invite>) => Invite)

type EagerUser = {
  readonly username?: string | null;
  readonly Id?: string | null;
  readonly mileage?: number | null;
  readonly moneyRaised?: number | null;
  readonly strikes?: number | null;
  readonly charity?: string | null;
  readonly stravaRefresh?: string | null;
}

type LazyUser = {
  readonly username?: string | null;
  readonly Id?: string | null;
  readonly mileage?: number | null;
  readonly moneyRaised?: number | null;
  readonly strikes?: number | null;
  readonly charity?: string | null;
  readonly stravaRefresh?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User)

type EagerGroupsModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<GroupsModel, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly usersList?: (User | null)[] | null;
  readonly host: User;
  readonly moneyMile?: number | null;
  readonly minMile?: number | null;
  readonly groupName?: string | null;
  readonly invites?: (string | null)[] | null;
  readonly startDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyGroupsModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<GroupsModel, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly usersList?: (User | null)[] | null;
  readonly host: User;
  readonly moneyMile?: number | null;
  readonly minMile?: number | null;
  readonly groupName?: string | null;
  readonly invites?: (string | null)[] | null;
  readonly startDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type GroupsModel = LazyLoading extends LazyLoadingDisabled ? EagerGroupsModel : LazyGroupsModel

export declare const GroupsModel: (new (init: ModelInit<GroupsModel>) => GroupsModel) & {
  copyOf(source: GroupsModel, mutator: (draft: MutableModel<GroupsModel>) => MutableModel<GroupsModel> | void): GroupsModel;
}

type EagerUsersModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UsersModel, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly groups?: (string | null)[] | null;
  readonly totalMileage?: number | null;
  readonly totalMoneyRaised?: number | null;
  readonly totalMoneyDonated?: number | null;
  readonly stravaRefresh?: string | null;
  readonly invites?: (Invite | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUsersModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UsersModel, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly groups?: (string | null)[] | null;
  readonly totalMileage?: number | null;
  readonly totalMoneyRaised?: number | null;
  readonly totalMoneyDonated?: number | null;
  readonly stravaRefresh?: string | null;
  readonly invites?: (Invite | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UsersModel = LazyLoading extends LazyLoadingDisabled ? EagerUsersModel : LazyUsersModel

export declare const UsersModel: (new (init: ModelInit<UsersModel>) => UsersModel) & {
  copyOf(source: UsersModel, mutator: (draft: MutableModel<UsersModel>) => MutableModel<UsersModel> | void): UsersModel;
}