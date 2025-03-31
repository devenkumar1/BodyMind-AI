import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TRAINER' | 'USER';
  avatar?: string;
  specialization?: string;
  rating?: number;
  hourlyRate?: number;
  bio?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'TRAINER', 'USER'],
    default: 'USER'
  },
  avatar: { type: String },
  specialization: { type: String },
  rating: { type: Number, default: 0 },
  hourlyRate: { type: Number },
  bio: { type: String },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema); 