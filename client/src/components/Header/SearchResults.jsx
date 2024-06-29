import { Link } from 'react-router-dom';

function SearchResults({ loading, error, data, searchItem }) {
    const searchResults = data.search;
    return (
        <div className="absolute w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
            { loading && <p className="p-4 text-gray-500">Searching for { searchItem }...</p> }

            { error && <p className="p-4 text-red-500">Something went wrong! { error.message }</p> }

            { !loading && !error && searchResults && searchResults.length > 0 ? (searchResults.map((result, index) => (
                <div key={ index } className="p-4 hover:bg-gray-100">
                    <Link to={ `/${ result.__typename.toLowerCase() }/${ result._id || result.id }` }>
                        { result.title || result.name } - { result.__typename }
                    </Link>
                </div>))) : (<p className="p-4">No results found for: { searchItem }</p>)
            }
        </div>
    );
}

export default SearchResults;