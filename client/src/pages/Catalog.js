import { useEffect, useState, Fragment } from 'react';
import { fetchCatalog } from '../lib';
import Card from "../components/Card";
import Search from "../components/Search";
import ToggleLamberto from '../components/ToggleLamberto';

export default function Catalog() {
  const [inventory, setInventory] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

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

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only visually-hidden">Loading...</span>
      </div>
    </div>
  );
  if (error) return (
        <>
        <div className="alert alert-info text-center mt-4" role="alert">
          Error Loading Catalog: {error.message}
        </div>
        <div className="d-flex justify-content-center">
          <ToggleLamberto />
        </div>
      </>
  );

  return (
    <div className="container">
      <Search />
      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 mb-4">
        {inventory?.map((card) => (
          <Fragment key={card.inventoryId}>
            <Card card={card} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
