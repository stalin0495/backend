import { UserModel, type IUser } from '../models/user.model.js';
import type { CreateUserData, IAuthRepository, UserEntity } from './auth.repository.interface.js';

// Única pieza del sistema que conoce Mongoose/MongoDB para credenciales: el resto depende de IAuthRepository
const toEntity = (doc: IUser): UserEntity => {
  const entity: UserEntity = {
    _id: doc._id.toString(),
    email: doc.email,
    password: doc.password,
    rol: doc.rol,
  };
  if (doc.createdAt) entity.createdAt = doc.createdAt;
  if (doc.updatedAt) entity.updatedAt = doc.updatedAt;
  return entity;
};

export class MongooseAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ email });
    return user ? toEntity(user) : null;
  }

  async createUser(userData: CreateUserData): Promise<UserEntity> {
    const user = await UserModel.create(userData);
    return toEntity(user);
  }
}
