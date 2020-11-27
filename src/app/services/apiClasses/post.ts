import { String, Number, Record, Static } from "runtypes";

export const Post = Record({
    postId: Number,
    userId: String,
    title: String,
    content: String,
    headerImage: String,
    createdDate: String,
    lastUpdated: String
});

export type Post = Static<typeof Post>;