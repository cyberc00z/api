const Mutation = {
    /**
     * Creates a like for post
     * 
     * @param {string} userId 
     * @param {string} postId 
     *  
     */
    createVote: async (root, {input : {userId ,postId}},  {Vote, Post, User}) => {
        const vote = await new Vote({user: userId, post:postId }).save();
        
        // push vote to post collection
        await Post.findOneAndUpdate({_id : postId}, {$push: {votes: vote.id}});
        // push vote to user collection
        await User.findOneAndUpdate({_id: userId},{ $push: {likes: like.id}});
        
        return like;
    },
    /**
     * downVote a Vote
     * 
     * @param {string} import {  } from 'module'
     */
    downVote: async (root, {input: {id}}, {Vote, User, Post}) => {
        const vote=  await Vote.findByIdAndRemove(id);
       
        // Delete vote from users collection
        await User.findOneAndUpdate({_id : vote.user}, {$pull: {votes: vote.id}});
        // Delete vote from posts collection
        await Post.findOneAndUpdate({_id: vote.post}, { $pull: {votes: vote.id} });
       
        return vote; 
    },   
};

export default {Mutation};