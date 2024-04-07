import mongoose from 'mongoose';
import date from 'date-and-time';

const topicSchema = new mongoose.Schema(
{   
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
    }]

}, { timestamps: true });

topicSchema.virtual("createdAtFormatted").get(function () {
    
    return date.format(this.createdAt, "dddd MMM DD, YYYY");
});

topicSchema.virtual("updatedAtFormatted").get(function () {
    
    return date.format(this.updatedAt, "dddd MMM DD, YYYY");
});

topicSchema.virtual('totalArticles').get(function () {

    return this.articles.length;
});

topicSchema.virtual('status').get(function () {

    return this.totalArticles > 0 ? "ACTIVE" : "INACTIVE";
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;