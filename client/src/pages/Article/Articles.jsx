import { useState } from 'react';
import { useAuth } from '../../utils/context';

import TopicList from '../../components/Topic/TopicList';
import ArticleList from '../../components/Article/ArticleList';
import SortDropdown from '../../components/Article/SortDropdown';
import AddArticleModal from '../../components/Article/AddArticleModal';

function Articles() {
    const currentUser = useAuth();
    const [sortBy, setSortBy] = useState("NEWEST");
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    return (
        <div className="flex mt-4 mx-4">
            <div className="w-1/3 mr-4 ml-4 mt-4">
               <TopicList onSelectTopic={ setSelectedTopicId } />
            </div>

            <div className="w-2/3 mr-4 mt-4">
                <div className="flex justify-between">
                    { currentUser && <AddArticleModal /> }
                    <SortDropdown value={ sortBy } onChange={ handleSortChange } />
                </div>
                   
                <ArticleList sortBy={ sortBy } selectedTopicId={ selectedTopicId } />
            </div>
        </div>
    );
}

export default Articles;