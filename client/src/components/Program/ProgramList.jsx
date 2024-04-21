import { useQuery } from '@apollo/client';
import { GET_PROGRAMS } from '../../graphql/queries/program';

import ProgramRow from './ProgramRow';

function ProgramList() {

    const { loading, error, data } = useQuery(GET_PROGRAMS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (

        <div className="max-w-sm border border-gray-200 bg-white rounded-md shadow-md p-4 mb-4">
            <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900">
                    Available Programs
                </h5>
            </div>

            <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                    { !loading && !error && (data.programs.length > 0 ?
                        data.programs.map((program) => (<ProgramRow key={ program._id } program={ program } />)) :
                        <p>No programs posted yet..</p>)
                    }
                </ul>
            </div>
        </div>
    );
}

export default ProgramList;