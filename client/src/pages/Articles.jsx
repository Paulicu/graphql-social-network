import { useState } from 'react';

import TopicList from '../components/Topic/TopicList';
import ArticleList from '../components/Article/ArticleList';
import SortDropdown from '../components/Article/SortDropdown';

function Articles() {

    const [sortBy, setSortBy] = useState("NEWEST");
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    const handleSortChange = (value) => {

        setSortBy(value);
    };

    return (

        <div className="flex">
            <div className="w-1/3 mr-4 ml-4 mt-4">
               <TopicList onSelectTopic={ setSelectedTopicId }/>
            </div>

            <div className="flex-grow mr-4 mt-4">
                <SortDropdown value={ sortBy } onChange={ handleSortChange } />

                <ArticleList sortBy={ sortBy } selectedTopicId={ selectedTopicId } />
            </div>
        </div>
    );
}

export default Articles;