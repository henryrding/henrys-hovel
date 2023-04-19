import { Link } from 'react-router-dom';
import { toDollars } from '../lib';

export default function Card({ card }) {
  const { name, collectorNumber, setName, setCode, rarity, foil, price, cardId, image } = card;

  return (
    <div className="card mx-auto max-w-sm max-w-md max-w-lg">
      <Link className="d-none d-md-block" to={`/details/${cardId}`}><img src={`https://c1.scryfall.com/file/scryfall-cards/normal${image}`} alt="Goblin King (foil) 7th Edition" className="card-img-top mt-3" /></Link>
      <Link className="d-block d-md-none" to={`/details/${cardId}`}><img src={`https://c1.scryfall.com/file/scryfall-cards/small${image}`} alt="Goblin King (foil) 7th Edition" className="card-img-top mt-3" /></Link>
      <div className="card-body px-0">
        <p className="card-title fw-bold">{name} #{collectorNumber} {foil && "(foil)"}</p>
        <p className="card-text m-0">Set: {setName} ({setCode.toUpperCase()})</p>
        <p className="card-text m-0">Rarity: {rarity}</p>
        <p className="card-text m-0">Price: {toDollars(price)}</p>
      </div>
    </div>
  );
}
