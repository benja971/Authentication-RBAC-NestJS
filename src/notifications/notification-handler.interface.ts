export interface NotificationHandler {
  sendNotification(userId: string, message?: string): Promise<void>;
}
