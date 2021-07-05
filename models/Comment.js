import { Mongoose } from "mongoose";

const Schema = Mongoose.Schema;

/**
 * 
 * Comment Schema that has relatio with Post and User
 */
const commentSchema = Schema(
    {
    comment: {
        type: String,
        required: true,
      },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }   
);

export default Mongoose.model('Comment', commentSchema);