export type InviteType = {
    sender: string;
    groupId: string;
  };
  
  export type UserType = {
    username: string;
    Id: string;
    mileage: number;
    moneyRaised: number;
    strikes: number;
    charity?: string;
    stravaRefresh: string;
  };
  
  export type GroupsModel = {
    id: string;
    usersList: UserType[];
    host: UserType;
    moneyMile: number;
    minMile: number;
    minDays: number;
    groupName: string;
    invites?: string[];
    startDate?: Date;
    moneyPool?:number;
    lastStavaCheck?: Date;
    createdAt?: Date;

  };
  
  export type UsersModel = {
    id: string;
    email: string;
    username: string;
    groups?: string[];
    totalMileage?: number;
    totalMoneyRaised?: number;
    totalMoneyDonated?: number;
    stravaRefresh?: string;
    invites?: InviteType[];
    lastStavaCheck?: Date;
    createdAt?: Date;

  };
  