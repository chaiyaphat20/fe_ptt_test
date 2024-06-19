export interface UserRegisterBody {
  "firstName": string,
  "lastName": string,
  "phone": string,
  "roomId": string
}

export interface UserRegisterResponse {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  room: string;
  createdAt: Date;
  updatedAt: Date;
}