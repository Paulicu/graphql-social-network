import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
{
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout"
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }]
    
}, { timestamps: true });

const Program = mongoose.model("Program", programSchema);

export default Program;