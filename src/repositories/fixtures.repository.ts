import { injectable } from "tsyringe";

import BaseRepository from "./base.repository";
import fixturesModel from "@app/models/fixtures.model";

@injectable()
export class FixturesRepository extends BaseRepository<any> {
  constructor() {
    super(fixturesModel);
  }
}
