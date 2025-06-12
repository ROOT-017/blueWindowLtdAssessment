import { Schema, model, Document } from "mongoose";
import { ITaskModel } from "../interfaces/tasks/model";

const TaskSchema = new Schema<ITaskModel>(
  {
    id: { 
      type: Number, 
      unique: true,
      index: true 
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [255, "Title cannot exceed 255 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    created_at: { type: Date, default: Date.now, immutable: true },
    updated_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: { 
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id; 
      }
    },
    toObject: { 
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id; 
      }
    },
  }
);

// Counter collection implementation
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = model('Counter', CounterSchema);

TaskSchema.pre<ITaskModel>("save", async function (next) {
  if (!this.isNew) {
    this.updated_at = new Date();
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'taskId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    this.id = counter.seq;
    next();
  } catch (err) {
    next(new Error(`Failed to generate auto-incremented ID: ${err.message}`));
  }
});

export const Task = model<ITaskModel>("Task", TaskSchema);