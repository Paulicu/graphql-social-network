import { Link } from 'react-router-dom';

function ArticleCard({ article }) {

    const author = article.author; 
    
    const maxLength = 100; 
    const content = article.content.length > maxLength ? article.content.substring(0, maxLength) + '...' : article.content;

    return (

        <div className="border border-gray-200 bg-white rounded-md shadow-md p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">{ article.title }</h2>

            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">{ article.topic.title }</span>

                <span className="text-gray-500">{ article.createdAtFormatted }</span>
            </div>

            <div className=" rounded-md mb-2">
                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center">
                        { author.profilePicture && (<img src={ author.profilePicture } alt="Profile Picture" className="w-8 h-8 rounded-full mr-2" />) }

                        <span>
                            { author.fullName }
                        </span>
                    </div>
                </div>
            </div>

            <p className="mb-2">
                { content }
            </p>

            <div className="flex items-center justify-between mb-2">
                <span className="">
                    Comments: { article.totalComments }
                </span>

                <span className="">
                    Views: { article.totalViews }
                </span>

                <Link to={ `/article/${ article._id }` } className="text-black hover:underline">
                    Read more
                </Link>
            </div>
        </div>
    );
}

export default ArticleCard;