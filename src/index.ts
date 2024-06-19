import express from 'express';
import bodyParser from 'body-parser';
import { CustomError, NotFoundError } from './types/errors';
import cors from 'cors';
import { NotificationService } from './service/notification-service';
import { Logger } from './util/logger';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200,
  };

const notificationService = new NotificationService();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors(corsOptions));


app.get('/notifications/health', (req, res) => {
  return res.status(200).json({message: "Hello, World!"});
})

app.get('/notifications/', async (req, res) => {
    Logger.log(`Getting all notifications which belongs to user: ${JSON.stringify(req.headers.user)}`);
    const userDataStr = req.headers.user;
    try {
        if (!userDataStr) {
            throw new NotFoundError('User data not provided');
          }
        const userData = JSON.parse(userDataStr as string);
        const reviews = await notificationService.getNotificationsByUser(userData);
        return res.json(reviews);
    } catch (err) {
      const code = err instanceof CustomError ? err.code : 500;
      return res.status(code).json({ message: (err as Error).message });
    }
});

// preko rabbit mq: obrisi sve notifikacije koji pripadaju korisniku

app.listen(PORT, () => {
  console.log(`Backend service running on http://localhost:${PORT}`);
});
