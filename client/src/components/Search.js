import { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import './Search.css';
import { fetchApiResponse } from '../lib';

export default function Search({ inventory, handleSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const timerId = setTimeout(() => {
      async function getResults() {
        setIsLoading(true);
        setError(null);
        try {
          const filteredResults = inventory ? inventory.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) : (
            await fetchApiResponse(searchQuery)
          );
          setFilteredInventory(filteredResults);
          handleSearch(filteredResults);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      }
      getResults();
    }, 500);

    return () => clearTimeout(timerId);
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
          name="search"
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
      {error && (
        <div className="alert alert-info text-center mt-4" role="alert">
          {error.message}
        </div>
      )}
      {isLoading && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
