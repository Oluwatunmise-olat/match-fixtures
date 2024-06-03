import mongoose from "mongoose";
import { container } from "tsyringe";

import { ModelNames } from "@app/shared/enums/models.enum";
import TeamsSchema from "./schema/teams.schema";

const teamsModelSchema = container.resolve(TeamsSchema);

export default mongoose.model(ModelNames.TEAMS, teamsModelSchema.schema);
