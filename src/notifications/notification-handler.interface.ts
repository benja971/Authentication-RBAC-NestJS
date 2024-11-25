import { User } from 'src/users/entities/user.entity';

export interface NotificationHandler {
  sendNotification(user: User, message?: string): Promise<void>;
}
