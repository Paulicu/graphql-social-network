import DeleteCommentButton from './DeleteCommentButton';
import UpdateCommentModal from './UpdateCommentModal';

function CommentCard({ comment, currentUser }) {

    return (

        <div className="bg-gray-100 p-3 mb-2 rounded">
            <p>{ comment.content }</p>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <img
                        src={ comment.author.profilePicture }
                        alt="Profile Picture"
                        className="w-6 h-6 rounded-full mr-2"
                    />

                    <p className="text-gray-500 text-sm">{ comment.author.fullName }</p>
                </div>

                <p className="text-gray-500 text-sm">{ comment.createdAtFormatted }</p>
            </div>

            { (currentUser && currentUser.role === "ADMIN") && (
                <div className="flex justify-end mt-2">
                    <UpdateCommentModal comment={comment} articleId={comment.articleId} />
                    <DeleteCommentButton commentId={comment._id} />
                </div>)
            }
        </div>
    );
}

export default CommentCard;