import mongoose from 'mongoose';
import date from 'date-and-time';

const daySchema = new mongoose.Schema(
{
    dayNumber: {
        type: Number,  
        min: 1,
        max: 7,
        required: true
    },
    isRestDay: {
        type: Boolean,
        required: true,
        default: false
    },
    workoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout"
    }
});

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
    goal: {
        type: String,
        enum: ["Muscle Gain", "Weight Loss", "Strength Gain"]
    },
    days: [daySchema],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }]
    
}, { timestamps: true });

programSchema.virtual("createdAtFormatted").get(function () {
    
    return date.format(this.createdAt, "dddd MMM DD, YYYY");
});

programSchema.virtual("updatedAtFormatted").get(function () {
    
    return date.format(this.updatedAt, "dddd MMM DD, YYYY");
});

programSchema.virtual("totalWorkouts").get(function () {
    
    return this.days.length;
});

programSchema.virtual("totalRatings").get(function () {
    
    return this.ratings.length;
});

const Program = mongoose.model("Program", programSchema);

export default Program;