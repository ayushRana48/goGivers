export type InviteType = {
  sender: string;
  groupId: string;
};

export type Run ={
  date: Date;
  distance: number;
}

export type Donation= {
  Id: string
  username: string
  groupId: string
  amount: number
  paid: boolean
}

export type Record={
  Id: string
  loser:string
  amount:number
  paid: boolean
  date: Date
}

export type UserType = {
  username: string;
  Id: string;
  mileage: number;
  runs:Run[];
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
  nextStrikeUpdate?: Date;
  records:Record[];
  currLoser:String;

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
  donations:Donation[]

};
