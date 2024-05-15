import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROGRAMS } from '../../graphql/queries/program';
import { NEW_PROGRAM_SUBSCRIPTION } from '../../graphql/subscriptions/program';
import ProgramRow from './ProgramRow';

function ProgramList() {

    const { loading, error, data, subscribeToMore } = useQuery(GET_PROGRAMS);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: NEW_PROGRAM_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const newProgram = subscriptionData.data.newProgramSubscription;
                return { programs: [newProgram, ...prev.programs] };
            },
        });
    
        return () => unsubscribe();
    }, [subscribeToMore]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (

        <div className="border border-gray-200 bg-white rounded-md shadow-md p-4 mb-4">
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