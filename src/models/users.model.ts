import mongoose from "mongoose";
import { container } from "tsyringe";

import UserSchema from "./schema/users.schema";
import { ModelNames } from "@app/shared/enums/models.enum";

const userModelSchema = container.resolve(UserSchema);

export default mongoose.model(ModelNames.USERS, userModelSchema.schema);
