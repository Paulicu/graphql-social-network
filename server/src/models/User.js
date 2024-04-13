import mongoose from 'mongoose';
import date from 'date-and-time';

const userSchema = new mongoose.Schema(
{
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "MEMBER"],
        default: "MEMBER"
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"]
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    }],
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout"
    }],
    programs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program"
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }]

}, { timestamps: true });

userSchema.virtual("createdAtFormatted").get(function () {

    return date.format(this.createdAt, "dddd MMM DD, YYYY");
});

userSchema.virtual('fullName').get(function () {

    return `${ this.firstName } ${ this.lastName }`;
});

userSchema.virtual("totalArticles").get(function () {

    return this.articles.length;
});

userSchema.virtual("totalTopics").get(function () {

    return this.topics.length;
});

const User = mongoose.model("User", userSchema);

export default User;