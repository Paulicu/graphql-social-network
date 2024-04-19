import mongoose from 'mongoose';
import date from 'date-and-time';

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
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
    },
    description: {
        type: String
    },
    equipment: {
        type: [String],
        required: true
    },
    muscleGroups: {
        type: [String],
        required: true
    },
    exercises: [exerciseSchema]
    
}, { timestamps: true });

workoutSchema.virtual("createdAtFormatted").get(function () {
    
    return date.format(this.createdAt, "dddd MMM DD, YYYY");
});

workoutSchema.virtual("updatedAtFormatted").get(function () {
    
    return date.format(this.updatedAt, "dddd MMM DD, YYYY");
});

workoutSchema.virtual('totalExercises').get(function() {
    
    return this.exercises.length;
});

workoutSchema.virtual('totalMuscleGroups').get(function () {

    return this.muscleGroups.length;
});

workoutSchema.virtual('totalEquipment').get(function () {

    return this.equipment.length;
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;