import { useEffect, useState, useCallback, useContext, Fragment } from 'react';
import { fetchCatalog } from '../lib';
import Card from "../components/Card";
import Search from "../components/Search";
import SpinningLogo from '../components/SpinningLogo';
import { ShopContext } from '../components/ShopContext';

export default function Catalog() {
  const [inventory, setInventory] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [searchResults, setsearchResults] = useState([]);
  const { user } = useContext(ShopContext);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const inventory = await fetchCatalog();
        setInventory(inventory);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    loadCatalog();
  }, []);

  const handleSearch = useCallback((results) => {
    setsearchResults(results);
  }, []);

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 87px)' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container">
      <div className="alert alert-info text-center mt-4" role="alert">
        Error Loading Catalog: {error.message}
      </div>
      <div className="d-flex justify-content-center">
        <SpinningLogo />
      </div>
    </div>
  );

  return (
    <div className="container">
      <Search inventory={inventory} handleSearch={handleSearch} />
      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 mb-4">
        {searchResults.map((card) => {
          if (user?.isAdmin) {
            return (
              <Fragment key={card.inventoryId}>
                <Card card={card} />
              </Fragment>
            );
          } else if (card.visible) {
            return (
              <Fragment key={card.inventoryId}>
                <Card card={card} />
              </Fragment>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}
