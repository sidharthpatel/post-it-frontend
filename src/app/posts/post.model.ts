export interface Post {
    /** Mongoose creates unique ids automatically. */
    id: string,
    title: string;
    content: string;
    imagePath: string;
    creator: string;
}
