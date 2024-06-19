import amqp from "amqplib/callback_api.js";
import { UsernameDTO } from "../types/users";
import { NotificationService } from "../service/notification-service";
import { Logger } from "../util/logger";
import { Notification } from "../types/notification";

export class EventQueue {
    private rabbit;
    constructor(private notificationService: NotificationService) {
        this.rabbit = amqp;
        this.init();
    }

    private init() {
        amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/`, (error, connection) => {
            if (error) {
               throw error;
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                const exchangeName = 'username-updated';
                channel.assertExchange(exchangeName, 'fanout', { durable: true });
    
                channel.assertQueue('', { exclusive: true }, (error2, q) => {
                    if (error2) {
                        throw error2;
                    }
    
                    channel.bindQueue(q.queue, exchangeName, '');
    
                    console.log(`Waiting for messages in ${q.queue}. To exit press CTRL+C`);
    
                    channel.consume(q.queue, (payload) => {
                        Logger.log(`Updating username: ${payload}`);
                        if (payload !== null) {
                            const usernames: UsernameDTO = JSON.parse(payload.content.toString());
                            console.log(`Updating username: ${JSON.stringify(usernames)}`);
                            this.notificationService.updateUsername(usernames);
                        }
                    }, { noAck: true });
                });

                const exchangeNameNotif = 'create-notification';
                channel.assertExchange(exchangeNameNotif, 'fanout', { durable: true });
    
                channel.assertQueue('', { exclusive: true }, (error2, q) => {
                    if (error2) {
                        throw error2;
                    }
    
                    channel.bindQueue(q.queue, exchangeNameNotif, '');
    
                    console.log(`Waiting for messages in ${q.queue}. To exit press CTRL+C`);
    
                    channel.consume(q.queue, (payload) => {
                        Logger.log(`Adding notification: ${payload}`);
                        if (payload !== null) {
                            const notification: Notification = JSON.parse(payload.content.toString());
                            this.notificationService.createNotification(notification);
                        }
                    }, { noAck: true });
                });
            });
        });
    }
}