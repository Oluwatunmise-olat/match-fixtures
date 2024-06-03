import mongoose from "mongoose";
import { container } from "tsyringe";

import { ModelNames } from "@app/shared/enums/models.enum";
import PlayersSchema from "./schema/players.schema";

const playersModelSchema = container.resolve(PlayersSchema);

export default mongoose.model(ModelNames.PLAYERS, playersModelSchema.schema);
