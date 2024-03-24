import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  isDisliked: {
    type: Boolean,
    default: false,
  },
  numViews: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  disLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Posts = mongoose.model("Post", postSchema);
export default Posts;
