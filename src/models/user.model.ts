import { Schema, model, type Document } from 'mongoose';

// Esquema de credenciales: la contraseña siempre se almacena como hash (bcrypt), nunca en texto plano
export interface IUser extends Document {
  email: string;
  password: string;
  rol: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'alumno' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model<IUser>('User', userSchema);
