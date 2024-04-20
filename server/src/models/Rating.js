import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
{
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

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;