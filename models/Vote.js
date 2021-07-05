import { mongo, Mongoose } from "mongoose";

const Schema = Mongoose.Schema;

/**
 * Vote Schema in relation with User and Post
 * 
 */
const voteSchema = Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

    },
    {
        timestamps: true,
    }
);

export default Mongoose.model('Vote', voteSchema);
