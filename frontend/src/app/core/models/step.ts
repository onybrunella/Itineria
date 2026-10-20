export interface Step {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
  date: string; // 'yyyy-MM-dd'
  note: string;
  orderIndex: number;
}

export interface CreateStepRequest {
  locationName: string;
  latitude: number;
  longitude: number;
  date: string;
  note: string;
  orderIndex: number;
}
