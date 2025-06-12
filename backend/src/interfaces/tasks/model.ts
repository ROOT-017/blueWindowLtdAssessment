import { Document } from "mongoose";

export interface ITaskModel extends Document {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
