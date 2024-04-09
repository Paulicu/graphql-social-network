function SortDropdown({ value, onChange }) {

    const handleSortChange = (e) => {
        
        onChange(e.target.value);
    };

    return (

        <select value={ value } onChange={ handleSortChange } className="mb-4">
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
        </select>
    );
}

export default SortDropdown;