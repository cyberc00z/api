import { Mongoose } from "mongoose";
import bcrypt, { hash } from 'bcryptjs';

const Schema = Mongoose.Schema;

/**
 * User schema that has refrences to Post, Vote, Comment, Notification and BOX in future
 * 
 */
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: false
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true
        },
        passwordResetToken: String,
        passwordResetTokenExpiryL: Date,
        password : {
            type: String,
            required: true,
        },
        profileImage: String,
        profileImagePublicId : String,
        isOnline: {
            type: Boolean,
            default: false,
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        Vote: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Vote'
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        notifications: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Notification'
            }
        ]
    },
    {
        timestamps: true,
    }
);

/**
 * Hashes the user password when it to Database
 * 
 */
userSchema.pre('save', function(next){
  if (!this.isModified('password')){
      return next();
  }
  bcrypt.genSalt(10, (error,salt ) => {
      if (error)  return next(error);

      bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) return next(err);

          this.password = hash;
          next();
      });
  });
});

export default Mongoose.model('User', userSchema);