import mongoose from "mongoose";
import date from "date-and-time";

const commentSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    articleId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

commentSchema.virtual("createdAtFormatted").get(function () {
    return date.format(this.createdAt, "dddd MMM DD, YYYY, HH:mm");
});

commentSchema.virtual("updatedAtFormatted").get(function () {
    return date.format(this.updatedAt, "dddd MMM DD, YYYY, HH:mm");
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;