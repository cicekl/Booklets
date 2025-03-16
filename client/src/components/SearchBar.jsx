import React, { useState } from "react";
import "../styles/Navbar.css"; 

function SearchBar({onSearch}) {

    const [query, setQuery] = useState("");
    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value); 
    };

    return (
        <div>
            <input type="text" 
            placeholder="Search..." 
            className="searchBar" 
            value={query}
            onChange={handleSearch}/>
        </div>
    );
}

export default SearchBar;