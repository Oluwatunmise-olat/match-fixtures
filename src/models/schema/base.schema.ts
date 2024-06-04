import { Schema } from "mongoose";

export default abstract class BaseSchema {
  public schema: Schema;

  constructor() {
    const baseFields = {
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
      deleted_at: { type: Date },
    };

    this.schema = new Schema(baseFields, { timestamps: true });
  }
}
