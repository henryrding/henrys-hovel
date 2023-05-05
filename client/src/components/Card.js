import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toDollars } from '../lib';
import { ShopContext } from "../components/ShopContext";

export default function Card({ card }) {
  const { name, collectorNumber, setName, setCode, rarity, finishes, finish, price, quantity, cardId, image } = card;
  const { user } = useContext(ShopContext);

  return (
    <div className="card mx-0">
      <Link className="d-none d-md-block position-relative" to={`/details/${cardId}/${finish}`}>
        <img src={`https://c1.scryfall.com/file/scryfall-cards/normal${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="card-img-top mt-3" />
        {quantity === 0 && <div className="card-img-overlay d-flex justify-content-center align-items-center mt-3" style={{ backgroundColor: 'gray', opacity: 0.5, borderRadius: "3.5%" }}>
          <h1 className="card-title text-center" style={{ color: 'black' }}>OUT OF STOCK</h1>
        </div>}
      </Link>
      <Link className="d-block d-md-none position-relative" to={`/details/${cardId}/${finish}`}>
        <img src={`https://c1.scryfall.com/file/scryfall-cards/small${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="card-img-top mt-3" />
        {quantity === 0 && <div className="card-img-overlay d-flex justify-content-center align-items-center mt-3" style={{ backgroundColor: 'gray', opacity: 0.5, borderRadius: "3.5%" }}>
          <h1 className="card-title text-center" style={{ color: 'black' }}>OUT OF STOCK</h1>
        </div>}
      </Link>
      <div className="card-body px-0">
        <p className="card-title fw-bold">{name} #{collectorNumber} {finish !== 'nonfoil' && `(${finish})`}</p>
        <p className="card-text m-0">Set: {setName} ({setCode.toUpperCase()})</p>
        <p className="card-text m-0">Rarity: {rarity}</p>
        {!finishes && <p className="card-text m-0">Price: {toDollars(price)}</p>}
        {user?.isAdmin && !finishes && <p className="card-text m-0">Quantity: {quantity}</p>}
      </div>
    </div>
  );
}
