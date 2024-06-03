import { Model } from "mongoose";

export default class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(payload: Partial<T>): Promise<T> {
    return await this.model.create(payload);
  }
}
