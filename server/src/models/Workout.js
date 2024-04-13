import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
{
    exerciseId: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        default: 0 
    },
    repetitions: {
        type: Number,
        default: 0
    }
});

const workoutSchema = new mongoose.Schema(
{
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    exercises: [exerciseSchema]
    
}, { timestamps: true });

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;