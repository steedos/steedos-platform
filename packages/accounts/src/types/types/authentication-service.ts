import { User } from "./user";
import { DatabaseInterface } from "./database-interface";

export interface AuthenticationService {
  server: any;
  serviceName: string;
  setStore(store: DatabaseInterface): void;
  authenticate(params: any): Promise<User | null>;
  getUserProfile(userId: string): Promise<any | null>;
  foundUser(user: any): Promise<any | null>;
}
