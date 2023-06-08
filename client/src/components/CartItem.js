import { useContext } from "react";
import { toDollars } from "../lib";
import { ShopContext } from '../components/ShopContext';

export default function CartItem({card, cartQuantity}) {
  const { inventoryId, name, collectorNumber, setName, setCode, rarity, finish, price, image, quantity } = card;
  const { removeFromCart, updateCartItemQuantity } = useContext(ShopContext);

  //creates array of options with values from 1 to quantity.
  const options = Array.from({ length: quantity }, (_, i) => i + 1);

  return (
    <div className="card m-4">
      <div className="row g-0">
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <img src={`https://c1.scryfall.com/file/scryfall-cards/small${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="img-fluid px-4 pt-2 " />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{name} #{collectorNumber} {finish !== 'nonfoil' && `(${finish})`}</h5>
            <p className="card-text">{setName} ({setCode.toUpperCase()}) ({rarity})</p>
            <p className="card-text">{toDollars(price)} X {`${cartQuantity}`} = {toDollars(price * cartQuantity)}</p>
            <div className="input-group mb-3 containter w-50">
              <select className="form-select text-center" onChange={event => updateCartItemQuantity(inventoryId, parseInt(event.target.value))} defaultValue={cartQuantity}>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <button type="button" className="btn btn-danger" onClick={() => removeFromCart(inventoryId)}>Remove from cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
