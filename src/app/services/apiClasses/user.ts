import { String, Record, Static } from "runtypes";

export const User = Record({
    userId: String,
    firstName: String,
    lastName: String,
    emailAddress: String
});

export type User = Static<typeof User>;