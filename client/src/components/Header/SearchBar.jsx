import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH } from '../../graphql/queries/search';
import { FaSearch, FaTimes } from 'react-icons/fa';

import SearchResults from './SearchResults';

function SearchBar() {
    const [searchItem, setSearchItem] = useState("");

    const [search, { loading, error, data }] = useLazyQuery(SEARCH, { variables: { contains: searchItem } });

    useEffect(() => {
        if (searchItem && searchItem.length > 2) {
            search();
        }

    }, [searchItem, search]);

    const handleChange = (e) => {
        setSearchItem(e.target.value);
    };

    const clearInput = () => {
        setSearchItem("");
    };

    return (
        <div className="relative">
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <input
                    type="text"
                    value={ searchItem }
                    onChange={ handleChange }
                    className="w-full p-2"
                    placeholder="Search..."
                />

                <button className="p-2 text-white">
                    { searchItem ? <FaTimes onClick={ clearInput } /> : <FaSearch /> }
                </button>
            </div>

            { data && searchItem.length > 2 && (<SearchResults loading={ loading } error={ error } data={ data } searchItem={ searchItem } />) }
        </div>
    );
}

export default SearchBar;