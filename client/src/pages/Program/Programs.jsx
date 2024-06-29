import { useAuth } from '../../utils/context';

import ProgramForm from "../../components/Program/ProgramForm";
import ProgramList from "../../components/Program/ProgramList";

function Programs() {
    const currentUser = useAuth();

    return (
        <div className="flex">
            <div className="w-2/3 mr-4 ml-4 mt-4">
                <ProgramList />
            </div>

            <div className="w-1/3 mr-4 mt-4">
                { currentUser && <ProgramForm /> }
            </div>
        </div>
    );
}

export default Programs;