import { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import './Search.css';

export default function Search({ inventory, handleSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([inventory]);

  useEffect(() => {
    const filteredResults = inventory.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(filteredResults);
    handleSearch(filteredResults);
  }, [inventory, searchQuery, handleSearch]);

  function handleSearchInput(event) {
    const query = event.target.value;
    setSearchQuery(query);
  }

  return (
    <>
      <div className="search input-group my-4">
        <span className="input-group-text">
          <CiSearch size={36} color="white" />
        </span>
        <input
          className="form-control"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInput}
        />
      </div>
      {filteredInventory.length === 0 && searchQuery.length > 0 && (
        <div className="alert alert-info text-center mt-4" role="alert">
          No results found
        </div>)}
    </>
  );
}
