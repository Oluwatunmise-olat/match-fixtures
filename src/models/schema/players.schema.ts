import { Schema, SchemaDefinition } from "mongoose";
import { singleton } from "tsyringe";

import BaseSchema from "./base.schema";
import { ModelNames } from "@app/shared/enums/models.enum";

@singleton()
export default class PlayersSchema extends BaseSchema {
  constructor() {
    super();

    const modelDefinitions = this.getPropertiesDefinition();
    this.schema.add(modelDefinitions);
  }

  private getPropertiesDefinition(): SchemaDefinition {
    return {
      name: { type: String, required: true },
      position: { type: String, required: true },
      team_id: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.TEAMS,
        required: true,
      },
      number: { type: Number, required: true },
    };
  }
}
