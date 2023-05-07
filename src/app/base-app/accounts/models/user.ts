export class User {
  id?: string;
  uid?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  customClaims?: any;
  isDisabled?: boolean;
  role?: RoleEnum;
  menu!: any[];
}

export enum RoleEnum {
  Collaborator,
  Admin,
  SuperAdmin
}