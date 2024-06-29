import mongoose from "mongoose";
import date from "date-and-time";

const daySchema = new mongoose.Schema({
    dayNumber: {
        type: Number, 
        required: true
    },
    isRestDay: {
        type: Boolean,
        default: true
    },
    workoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
        default: null
    }
});

const programSchema = new mongoose.Schema({
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
        required: true,
        enum: ["Muscle Gain", "Weight Loss", "Strength Gain"]
    },
    days: {
        type: [daySchema],
        required: true
    },
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
    return this.days.filter(day => day.workoutId !== null).length;
});

programSchema.virtual("totalRatings").get(function () {
    return this.ratings.length;
});

programSchema.pre("save", function(next) {
    this.days.forEach((day, index) => {
        day.dayNumber = index + 1; 
        day.isRestDay = !day.workoutId;
    });
    next();
});

const Program = mongoose.model("Program", programSchema);

export default Program;