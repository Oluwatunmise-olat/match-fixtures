import { injectable } from "tsyringe";

import BaseRepository from "./base.repository";
import teamsModel from "@app/models/teams.model";

@injectable()
export class TeamsRepository extends BaseRepository<any> {
  constructor() {
    super(teamsModel);
  }
}
