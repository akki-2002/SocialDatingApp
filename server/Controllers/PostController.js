import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";



export const createPost = async (req, res) => {
  const newPost = new PostModel({
    ...req.body,
    hashtags: req.body.hashtags || [], 
  });

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};




export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};


export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId, hashtags } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: { ...req.body, hashtags: hashtags || [] } });
      res.status(200).json("Post updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};



export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


export const getTimelinePosts = async (req, res) => {
  const allPosts = await PostModel.find({}).sort({createdAt: -1});
  return res.status(200).json(allPosts)
};


  export const addComment = async (req, res) => {
    const postId = req.params.id;
    const { userId, username, text } = req.body;
  
    try {
      const post = await PostModel.findById(postId);
      const newComment = {
        userId,
        username,
        text,
        createdAt: new Date(),
      };
  
      post.comments.push(newComment);
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  export const getComments = async (req, res) => {
    const postId = req.params.id;
  
    try {
      const post = await PostModel.findById(postId);
      res.status(200).json(post.comments);
    } catch (error) {
      res.status(500).json(error);
    }
  };










export const getTrendingHashtags = async (req, res) => {
  try {
    const hashtags = await PostModel.aggregate([
      { $unwind: "$hashtags" },  // Deconstruct the hashtags array
      { $group: { _id: "$hashtags", shares: { $sum: 1 } } },  // Group by hashtag and count occurrences
      { $sort: { shares: -1 } }  // Sort by number of occurrences (shares)
    ]);
    
    res.status(200).json(hashtags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




