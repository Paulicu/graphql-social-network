import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
{
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    days: [{
        dayNumber: {
            type: Number,  
            min: 1,
            max: 7,
            required: true
        },
        workoutId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workout"
        }
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }]
    
}, { timestamps: true });

const Program = mongoose.model("Program", programSchema);

export default Program;