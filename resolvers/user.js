import { Mongoose } from "mongoose";
import bcrypt from 'bcryptjs';
import { withFilter } from "apollo-server";

import {generateToken} from "../utils/generate-token";
import { pubSub } from "../utils/apollo-server";

import {IS_USER_ONLINE} from "../constants/Subscriptions";


const AUTH_TOKEN_EXPIRY = '1y';
const RESET_PASSWORD_TOKEN_EXPIRY = 3600000;

const Query =  {
    /**
     * Gets the current User
     */
    getAuthUser: async (root, args, {authUser, User}) => {
        if (!authUser) return null;

        // if User is authenticated, update it's isOnline field to true
        const user = await User.findOneAndUpdate({email: authUser.email}, {isOnline: true})
            .populate({path: 'posts', options: {sort: {createdAt: 'desc'}}})
            .populate('votes')
            .populate({
                path: 'notifications',
                populate: [
                    {path : 'author'},
                    {path: 'vote', populate: {path : 'post'}},
                    {path: 'comment', populate: {path: 'post'}},
                ],
                match: {seen: false},
            });
        user.newNotifications = user.notifications;   
        
        return user;
    },

    /**
     * Verifies reset password token
     * 
     * @param {string} email 
     * @param {string} token 
     */
    verifyResetPasswordToken: async (root, {email, token}, { User  }) => {
        // Check if user exists and token is valid
        const user = await User.findOne({
            email, 
            passwordResetToken: token,
            passwordResetTokenExpiry: {
                $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
            },
        });
        if (!user){
            throw new Error('This Token is either invalid or expired!');
        }
        return {message : 'Success'};
    },
};

const Mutation = {
    /**
     * Sings in user
     *
     * @param {string} email 
     * @param {string} password 
     */
    signIn: async (root,  {input: {email, password}}, {User}) => {
        const user = await User.findOne().or([{email : email}]);

        if (!user){
            throw new Error(' User not found. ');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword){
            throw new Error(' Invalid Password! ');
        }
        return {
            token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY)
        }
    } 

}