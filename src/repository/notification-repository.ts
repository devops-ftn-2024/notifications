import { Collection, Filter, MongoClient, ObjectId } from "mongodb";
import { UsernameDTO } from "../types/users";
import { Notification } from "../types/notification";

interface MongoReview extends Omit<Notification, '_id'> {
    _id?: ObjectId;
}


export class NotificationRepository {

    private client: MongoClient;
    private database_name: string;
    private collection_name: string;
    private collection: Collection<MongoReview>;

    constructor() {
        if (!process.env.MONGO_URI) {
            throw new Error("Missing MONGO_URI environment variable");
        }
        if (!process.env.MONGO_DB_NAME) {
            throw new Error("Missing MONGO_DB_NAME environment variable");
        }
        if (!process.env.MONGO_COLLECTION_NAME) {
            throw new Error("Missing MONGO_COLLECTION_NAME environment variable");
        }
        this.client = new MongoClient(process.env.MONGO_URI);
        this.database_name = process.env.MONGO_DB_NAME;
        this.collection_name = process.env.MONGO_COLLECTION_NAME;
        this.collection = this.client.db(this.database_name).collection(this.collection_name);
    }

    async createReview(notification: Notification) {
        const {_id, ...notificationData} = notification;
        const result = await this.collection.insertOne(notificationData);
        return result.insertedId;
    }

    async getNotificationsByUser(username: string) {
        const filter = { username };
        return this.collection.find(filter).toArray();
    }

    async updateUsername(usernameDTO: UsernameDTO) {
        const { oldUsername, newUsername } = usernameDTO;
        const result = await this.collection.updateMany({ username: oldUsername }, { $set: { username: newUsername } });
        return result.modifiedCount > 0;
    }
}