import { injectable } from "tsyringe";

import BaseRepository from "./base.repository";
import usersModel from "@app/models/users.model";

@injectable()
export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(usersModel);
  }
}
