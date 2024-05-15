import { FaRegStar, FaRegStarHalf } from 'react-icons/fa';

function AverageRating({ averageRating }) {
    const className = "w-10 h-10"
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 !== 0;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaRegStar key={ i } className={ className } />);
    }

    if (hasHalfStar) {
        stars.push(<FaRegStarHalf key={ fullStars } className={ className } />);
    }

    return (
        <div className="flex items-center text-yellow-300">
            { stars.map((star, index) => (<span key={ index }>{ star }</span>)) }
        </div>
    );
}

export default AverageRating;