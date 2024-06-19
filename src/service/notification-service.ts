
import { EventQueue } from "../gateway/event-queue";
import { NotificationRepository } from "../repository/notification-repository";
import { BadRequestError } from "../types/errors";
import { Notification } from "../types/notification";
import { LoggedUser, Role, UsernameDTO } from "../types/users";
import { Logger } from "../util/logger";


export class NotificationService {
    private repository: NotificationRepository;
    private eventQueue: EventQueue;

    constructor() {
        this.repository = new NotificationRepository();
        this.eventQueue = new EventQueue(this);
    }

    async createNotification(notification: Notification) {
        Logger.log(`Creating notification: ${JSON.stringify(notification)}`);
        const notificationId = await this.repository.createReview(notification);
        // via web socker emit notification
    }

    async getNotificationsByUser(user: LoggedUser) {
        if (!user?.username) {
            throw new BadRequestError("Missing username parameter");
        }
        return this.repository.getNotificationsByUser(user.username);
    }

    async updateUsername(usernameDTO: UsernameDTO) {
        if (!usernameDTO?.oldUsername || !usernameDTO?.newUsername) {
            throw new BadRequestError("Missing username parameter");
        }
        return this.repository.updateUsername(usernameDTO);
    }
}