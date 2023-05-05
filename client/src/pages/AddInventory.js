import { useState, useCallback, useContext, Fragment} from "react";
import { Link } from 'react-router-dom';
import Card from "../components/Card";
import Search from "../components/Search";
import ToggleLamberto from "../components/ToggleLamberto";
import { ShopContext } from '../components/ShopContext';

export default function AddInventory() {
  const [apiResults, setApiResults] = useState([]);
  const { user } = useContext(ShopContext);

  const handleApiSearch = useCallback((results) => {
    const formattedResults = results.map((card) => {
      return {
        name: card.name,
        collectorNumber: card.collector_number,
        setName: card.set_name,
        setCode: card.set,
        rarity: card.rarity,
        finishes: card.finishes.join(', '),
        finish: card.finishes[0],
        cardId: card.id,
        image: card.card_faces && card.card_faces[0].image_uris ? card.card_faces[0].image_uris.normal.substring(32) : card.image_uris?.normal.substring(32),
        manaCost: card.card_faces ? card.card_faces[0].mana_cost : card.mana_cost,
        typeLine: card.card_faces ? card.card_faces[0].type_line : card.type_line,
        oracleText: card.card_faces ? (card.card_faces[0].oracle_text ? card.card_faces[0].oracle_text : '') : (card.oracle_text ? card.oracle_text : ''),
        power: card.card_faces ? (card.card_faces[0].power ? card.card_faces[0].power : '') : (card.power ? card.power : ''),
        toughness: card.card_faces ? (card.card_faces[0].toughness ? card.card_faces[0].toughness : '') : (card.toughness ? card.toughness : ''),
        flavorText: card.card_faces ? (card.card_faces[0].flavor_text ? card.card_faces[0].flavor_text : '') : (card.flavor_text ? card.flavor_text : ''),
        artist: card.artist
      }
    })
    setApiResults(formattedResults);
  }, []);

  return (
    <div className="container">
      {!user?.isAdmin ? (
        <>
          <div className="alert alert-info text-center mt-4" role="alert">
            Unauthorized
          </div>
          <div className="d-flex justify-content-center">
            <ToggleLamberto />
            <p className="text-muted" style={{ textDecorationSkipInk: "none" }}>
              <Link to="/">Return to the catalog</Link>
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="pt-4">Add Inventory</h1>
          <Search handleSearch={handleApiSearch} />
          {<div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 mb-4">
            {apiResults.map((card) => {
              return (
                <Fragment key={card.cardId}>
                  <Card card={card} />
                </Fragment>
              );
            })}
          </div>}
        </>
      )}
    </div>
  );
}
