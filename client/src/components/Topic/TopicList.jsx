import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOPICS } from '../../graphql/queries/topic';
import { NEW_TOPIC_SUBSCRIPTION } from '../../graphql/subscriptions/topic';
import TopicRow from './TopicRow';
import AddTopicModal from './AddTopicModal';
import { useAuth } from '../../utils/context';

function TopicList({ onSelectTopic }) {

    const currentUser = useAuth();
    const [selectedTopic, setSelectedTopic] = useState(null);
    const { loading, error, data, subscribeToMore } = useQuery(GET_TOPICS);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: NEW_TOPIC_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const newTopic = subscriptionData.data.newTopicSubscription;
                return { topics: [newTopic, ...prev.topics] };
            },
        });
    
        return () => unsubscribe();
    }, [subscribeToMore]);

    const handleTopicClick = (topicId) => {

        if (selectedTopic === topicId) {

            setSelectedTopic(null); 
            onSelectTopic(null); 
        } 
        else {

            setSelectedTopic(topicId); 
            onSelectTopic(topicId); 
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    return (
        
        <div className="max-w-sm border border-gray-200 bg-white rounded-md shadow-md p-4 mb-4">
            <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900">
                    Available Topics
                </h5>
                
                { (currentUser && currentUser.role === "ADMIN") && <AddTopicModal /> }
            </div>

            <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                    { !loading && !error && (data.topics.length > 0 ?
                        data.topics.map((topic) => (<TopicRow key={ topic._id } topic={ topic } onSelectTopic={ handleTopicClick } selectedTopic={ selectedTopic } />)) :
                        <p>No topics posted yet..</p>)
                    }
                </ul>
            </div>
        </div>
    );
}
  
export default TopicList;