import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
{
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
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