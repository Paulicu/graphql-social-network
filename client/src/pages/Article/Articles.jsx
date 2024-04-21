import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from '../../graphql/queries/user';

import TopicList from '../../components/Topic/TopicList';
import ArticleList from '../../components/Article/ArticleList';
import SortDropdown from '../../components/Article/SortDropdown';
import AddArticleModal from '../../components/Article/AddArticleModal';

function Articles() {

    const [sortBy, setSortBy] = useState("NEWEST");
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    const handleSortChange = (value) => {

        setSortBy(value);
    };

    const { data } = useQuery(GET_AUTHENTICATED_USER);
    const currentUser = data.authUser;

    return (

        <div className="flex">
            <div className="w-1/3 mr-4 ml-4 mt-4">
               <TopicList onSelectTopic={ setSelectedTopicId } currentUser={ currentUser }/>
            </div>

            <div className="flex-grow mr-4 mt-4">
                <SortDropdown value={ sortBy } onChange={ handleSortChange } />

                { currentUser && <AddArticleModal /> }

                <ArticleList sortBy={ sortBy } selectedTopicId={ selectedTopicId } />
            </div>
        </div>
    );
}

export default Articles;