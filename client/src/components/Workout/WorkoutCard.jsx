function WorkoutCard({ workout }) {

    const { author, createdAt } = workout;

    return (
        
        <div className="border border-gray-200 bg-white rounded-md shadow-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">
                Workout by { author.fullName }
            </h2>

            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">
                    Created on: { createdAt }
                </span>
            </div>
        </div>
    );
}

export default WorkoutCard;
