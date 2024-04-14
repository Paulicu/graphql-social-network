import DeleteTopicButton from './DeleteTopicButton';
import UpdateTopicModal from './UpdateTopicModal';

function TopicRow({ topic, onSelectTopic, selectedTopic, currentUser }) {

    return (

        <li className="py-3 sm:py-4" >
            <div className={ `cursor-pointer flex items-center space-x-4 ${ selectedTopic === topic._id ? 'bg-gray-100 border border-gray-300 rounded-md px-2 p-1' : '' }` } onClick={() => onSelectTopic(topic._id)}>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                        { topic.title }
                    </p>

                    <p className={ `truncate text-sm ${ topic.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500' }` }>
                        { topic.status }: { topic.totalArticles } articles
                    </p>
                </div>

               
            </div> 

            <div className="inline-flex items-center text-base text-gray-900 mt-2">
                { (currentUser && currentUser.role === "ADMIN") && (
                    <>
                        <UpdateTopicModal topic={ topic } />
                        <DeleteTopicButton topicId={ topic._id } />
                    </>)
                }
            </div>
        </li>
    );
}

export default TopicRow;