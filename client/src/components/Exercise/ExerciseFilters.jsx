import { useQuery } from '@apollo/client';
import { GET_EXERCISE_FILTERS } from '../../graphql/queries/exercise';

function ExerciseFilters({ selectedFilters, onChange }) {
    const { loading, error, data } = useQuery(GET_EXERCISE_FILTERS);

    const handleCheckboxChange = (filterType, value) => {
        onChange(filterType, value);
    };

    if (loading) return <p>Loading Filters...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (
        <div className="grid grid-cols-3 gap-4 bg-white rounded-md shadow-md p-4">
            <div className="col-span-1">
                <h3 className="mb-2 text-lg font-semibold">
                    Equipment
                </h3>

                <div className="grid grid-cols-2 gap-2">
                    { data.equipmentList.map((equipment) => (
                        <label key={ equipment } className="block">
                            <input
                                type="checkbox"
                                id = { equipment }
                                value={ equipment }
                                checked={ selectedFilters.equipment.includes(equipment) }
                                onChange={ (e) => handleCheckboxChange("equipment", e.target.value) }
                            />
                            { equipment }
                        </label>))
                    }
                </div>
            </div>

            <div className="col-span-1">
                <h3 className="mb-2 text-lg font-semibold">
                    Body Parts
                </h3>

                <div className="grid grid-cols-2 gap-2">
                    { data.bodyPartList.map((bodyPart) => (
                        <label key={ bodyPart } className="block">
                            <input
                                type="checkbox"
                                id = { bodyPart }
                                value={ bodyPart }
                                checked={ selectedFilters.bodyParts.includes(bodyPart) }
                                onChange={ (e) => handleCheckboxChange("bodyParts", e.target.value) }
                            />
                            { bodyPart }
                        </label>))
                    }
                </div>
            </div>

            <div className="col-span-1">
                <h3 className="mb-2 text-lg font-semibold">
                    Target Muscles
                </h3>

                <div className="grid grid-cols-2 gap-2">
                    { data.targetList.map((target) => (
                        <label key={ target } className="block">
                            <input
                                type="checkbox"
                                id={ target }
                                value={ target }
                                checked={ selectedFilters.targets.includes(target) }
                                onChange={ (e) => handleCheckboxChange("targets", e.target.value) }
                            />
                            { target }
                        </label>))
                    }
                </div>
            </div>
        </div>
    );
}

export default ExerciseFilters;