import { Mongoose } from "mongoose";

const Schema = Mongoose.Schema;

/**
 * Notification in relation with post, vote , comment
 */

const notificationSchema = Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref : 'User',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        post: Schema.Types.ObjectId ,
        vote: {
            type: Schema.Types.ObjectId,
            ref: 'Vote'
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }, 
    },
    {
        timestamp: true,
    }
);

export default Mongoose.model('Notification', notificationSchema);