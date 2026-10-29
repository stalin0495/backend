// Contrato agnóstico al motor de persistencia: el resto del backend solo conoce esta interfaz
export interface UserEntity {
  _id: string;
  email: string;
  password: string;
  rol: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  rol?: string;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  createUser(userData: CreateUserData): Promise<UserEntity>;
}
