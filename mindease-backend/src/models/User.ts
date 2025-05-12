import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// For the password validator function
interface IUserDocument extends mongoose.Document {
  googleId?: string;
}

// Create the schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Only required if not using OAuth
      required: function(this: IUserDocument): boolean {
        return !this.googleId;
      },
      minlength: 6,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Create and export the model
export const User = mongoose.model<IUser>('User', userSchema); 