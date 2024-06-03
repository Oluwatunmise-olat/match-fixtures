import { Schema, SchemaDefinition } from "mongoose";
import { singleton } from "tsyringe";

import BaseSchema from "./base.schema";
import { ModelNames } from "@app/shared/enums/models.enum";

@singleton()
export default class FixturesSchema extends BaseSchema {
  constructor() {
    super();

    const modelDefinitions = this.getPropertiesDefinition();
    this.schema.add(modelDefinitions);
  }

  private getPropertiesDefinition(): SchemaDefinition {
    return {
      kickoff_at: { type: Date },
      stadium: { type: String, required: true },
      home_team_id: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.TEAMS,
        required: true,
      },
      away_team_id: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.TEAMS,
        required: true,
      },
    };
  }
}
