import { ObjectId } from "mongodb";

export interface Notification {
    _id?: string | ObjectId;
    type: Type;
    username: string;
    text: string;
    entityId: string; // reservationId or reviewId
}

export enum Type {
    // for host
    NEW_RESERVATION = 'NEW_RESERVATION',
    CANCELLED_RESERVATION = 'CANCELLED_RESERVATION',
    HOST_REVIEWED = 'HOST_REVIEWED',
    ACCOMMODATION_REVIEWED = 'ACCOMMODATION_REVIEWED',
    // for guest
    RESERVATION_STATUS_CHANGED = 'RESERVATION_STATUS_CHANGED',
}