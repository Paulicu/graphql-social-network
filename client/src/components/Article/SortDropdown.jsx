import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';

function SortDropdown({ value, onChange }) {
    const handleSortChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="relative inline-block cursor-pointer">
            <div className="flex items-center bg-black text-white rounded-md px-4 py-2">
                <select value={ value } onChange={ handleSortChange } className="bg-black text-white appearance-none focus:outline-none pr-8 cursor-pointer">
                    <option value="NEWEST">Newest</option>
                    <option value="OLDEST">Oldest</option>
                </select>
                <div className="absolute right-2">
                    { value === 'NEWEST' ? <FaSortAmountDown className="text-white" /> : <FaSortAmountUp className="text-white" /> }
                </div>
            </div>
        </div>
    );
}

export default SortDropdown;