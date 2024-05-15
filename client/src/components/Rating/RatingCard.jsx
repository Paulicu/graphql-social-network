import { useAuth } from '../../utils/context';
import { FaRegStar } from 'react-icons/fa';

import DeleteRatingButton from './DeleteRatingButton';
import UpdateRatingModal from './UpdateRatingModal';

function RatingCard({ rating }) {
    const currentUser = useAuth();
    const isAuthor = currentUser && rating.author._id === currentUser._id;
    const isAdmin = currentUser && (currentUser.role === "ADMIN");

    const generateStars = () => {
        const stars = [];
        for (let i = 0; i < rating.stars; i++) {
            stars.push(<FaRegStar key={ i } className="text-yellow-400" />);
        }
        return stars;
    };
    
    return (
        <div className="bg-gray-100 p-3 mb-2 rounded">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={ rating.author.profilePicture }
                        alt="Profile Picture"
                        className="w-6 h-6 rounded-full mr-2"
                    />

                    <p className="text-gray-500 text-sm">{ rating.author.fullName }</p>
                </div>

                <p className="text-gray-500 text-sm">{ rating.createdAtFormatted }</p>
            </div>
            <div className="flex items-center mt-2">{ generateStars() }</div>

            <div className="flex items-center mt-2">{ rating.message }</div>

            <div className="flex justify-end mt-2">
                { (isAuthor || isAdmin) && (
                    <>
                        <UpdateRatingModal rating={ rating } programId={ rating.programId } />

                        <DeleteRatingButton ratingId={ rating._id } />
                    </>)
                }
            </div>
        </div>
    );
}

export default RatingCard;