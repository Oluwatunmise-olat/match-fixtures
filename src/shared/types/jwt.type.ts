import { UserRoles } from "../enums/models.enum";

export type JwtPayloadContract = {
  id: string;
  role: UserRoles;
};
