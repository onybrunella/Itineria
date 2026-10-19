export type TripStatus = 'DRAFT' | 'PUBLISHED';

export interface UserInfo {
  id: number;
  pseudo: string;
}

export interface Trip {
  id: number;
  title: string;
  description: string;
  startDate: string;   //'yyyy-MM-dd'
  endDate: string;
  status: TripStatus;
  user: UserInfo;
}

export interface CreateTripRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
}