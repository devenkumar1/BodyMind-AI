import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ITrainingSession extends Document {
  trainer: IUser['_id'];
  user: IUser['_id'];
  date: Date;
  duration: number;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  meetingLink?: string;
  notes?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const trainingSessionSchema = new Schema<ITrainingSession>({
  trainer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  meetingLink: { type: String },
  notes: { type: String },
  price: { 
    type: Number, 
    required: true 
  }
}, {
  timestamps: true
});

// Index for efficient querying
trainingSessionSchema.index({ trainer: 1, date: 1 });
trainingSessionSchema.index({ user: 1, date: 1 });
trainingSessionSchema.index({ status: 1 });

export const TrainingSession = mongoose.model<ITrainingSession>('TrainingSession', trainingSessionSchema); 