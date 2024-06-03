import { injectable } from "tsyringe";

import BaseRepository from "./base.repository";
import playersModel from "@app/models/players.model";

@injectable()
export class PlayerRepository extends BaseRepository<any> {
  constructor() {
    super(playersModel);
  }
}
