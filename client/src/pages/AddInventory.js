import { useState, useCallback, useContext, Fragment} from "react";
import { Link } from 'react-router-dom';
import Card from "../components/Card";
import Search from "../components/Search";
import SpinningLogo from "../components/SpinningLogo";
import formatApiResults from "../lib/format-api-results";
import { ShopContext } from '../components/ShopContext';

export default function AddInventory() {
  const [apiResults, setApiResults] = useState([]);
  const { user } = useContext(ShopContext);

  const handleApiSearch = useCallback((results) => {
    const formattedResults = formatApiResults(results);
    setApiResults(formattedResults);
  }, []);

  return (
    <div className="container">
      {!user?.isAdmin ? (
        <>
          <div className="alert alert-info text-center mt-4" role="alert">
            Unauthorized
          </div>
          <div className="text-center mb-5">
            <SpinningLogo />
            <p className="text-muted" style={{ textDecorationSkipInk: "none" }}>
              <Link to="/">Return to the catalog</Link>
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="pt-4">Add Inventory</h1>
          <Search handleSearch={handleApiSearch} />
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 mb-4">
            {apiResults.map((card) => {
              return (
                <Fragment key={card.cardId}>
                  <Card card={card} />
                </Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
