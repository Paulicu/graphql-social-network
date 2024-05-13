import mongoose from "mongoose";
import date from "date-and-time";

const ratingSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        default: ""
    }
}, { timestamps: true });

ratingSchema.virtual("createdAtFormatted").get(function () {
    return date.format(this.createdAt, "dddd MMM DD, YYYY, HH:mm");
});

ratingSchema.virtual("updatedAtFormatted").get(function () {
    return date.format(this.updatedAt, "dddd MMM DD, YYYY, HH:mm");
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;