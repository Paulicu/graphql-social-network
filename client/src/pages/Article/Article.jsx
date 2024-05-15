import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ARTICLE } from '../../graphql/queries/article';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../utils/context';

import UpdateArticleModal from '../../components/Article/UpdateArticleModal';
import DeleteArticleButton from '../../components/Article/DeleteArticleButton';
import AddCommentForm from '../../components/Comment/AddCommentForm';
import CommentList from '../../components/Comment/CommentList';

function Article() {
    const currentUser = useAuth();
    const { articleId } = useParams();
    const { loading, data, error } = useQuery(GET_ARTICLE, { variables: { id: articleId } });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong! { error.message }</p>;

    const article = data.article;
    const isAuthor = currentUser && article.author._id === currentUser._id;
    const isAdmin = currentUser && (currentUser.role === "ADMIN");

    return (
        <div className="flex">
            <div className="w-2/3 mr-4 ml-4 mt-4">
                <div className="flex items-center mb-4">
                    <button className="flex items-center bg-black text-white px-4 py-2 mr-8 rounded-md hover:bg-gray-800">
                        <Link to="/articles" className='flex items-center text-white'>
                            <FaArrowLeft className="mr-2" /> Go Back
                        </Link>
                    </button>

                    { (isAuthor || isAdmin) && (
                        <>
                            <UpdateArticleModal article={ article } />
                            <DeleteArticleButton articleId={ article._id } />
                        </>)
                    }
                </div>
                <h1 className="text-3xl font-semibold mb-4">{ article.title }</h1>

                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{ article.content }</p>

                <div className="flex items-center">
                    <img src={ article.author.profilePicture } alt="Profile Picture" className="w-8 h-8 rounded-full mr-2" />

                    <span className="text-gray-500">
                        { article.author.fullName } on { article.updatedAtFormatted !== article.createdAtFormatted ? article.updatedAtFormatted : article.createdAtFormatted }
                    </span>
                </div> 
                
                { currentUser && <AddCommentForm articleId={ article._id } /> }

                <h2 className="text-xl font-semibold mb-2">
                    Comments ({ article.totalComments })
                </h2>

                <CommentList articleId={ article._id } />
            </div>

            <div className="w-1/3 mr-4 ml-4 mt-4 bg-white rounded-md border border-gray-300 p-4">
                <h2 className="text-xl font-semibold mb-2">{ article.topic.title }</h2>
                <p className="text-gray-600">{ article.topic.description }</p>
                <div className="flex items-center mb-2">
                    <img src={ article.topic.author.profilePicture } alt="Profile Picture" className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-gray-500">
                        Maintained by: { article.topic.author.fullName }
                    </span>
                </div>
                <p className="text-gray-500 mb-2">
                    Created on: { article.topic.createdAtFormatted }
                </p>
                <p className="text-gray-500">
                    Last updated on: { article.topic.updatedAtFormatted }
                </p>
            </div>
        </div>
    );
}

export default Article;