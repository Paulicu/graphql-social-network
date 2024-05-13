import mongoose from "mongoose";
import date from "date-and-time";

const articleSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true });

articleSchema.virtual("createdAtFormatted").get(function () {
    return date.format(this.createdAt, "dddd MMM DD, YYYY");
});

articleSchema.virtual("updatedAtFormatted").get(function () {
    return date.format(this.updatedAt, "dddd MMM DD, YYYY");
});

articleSchema.virtual("totalComments").get(function () {
    return this.comments.length;
});

const Article = mongoose.model("Article", articleSchema);

export default Article;