import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { addToInventory ,toDollars } from '../lib';
import { ShopContext } from "../components/ShopContext";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai';

export default function Card({ card }) {
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [cost, setCost] = useState(0);
  const [cardFinish, setCardFinish] = useState('nonfoil');
  const { name, collectorNumber, setName, setCode, rarity, finishes, finish, price, quantity, cardId, image } = card;
  const { user } = useContext(ShopContext);

  function handleQuantityToAddChange(event) {
    const inputQuantity = parseInt(event.target.value);
    if (!isNaN(inputQuantity)) {
      setQuantityToAdd(inputQuantity);
    }
  }

  function handleCostChange(event) {
    const inputPrice = parseInt(event.target.value);
    if (!isNaN(inputPrice)) {
      setCost(inputPrice);
    }
  }

  function handleCardFinishChange(event) {
    setCardFinish(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await addToInventory(card, quantityToAdd, cost, cardFinish);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <div className="card mx-0">
        {!finishes ? (
          <>
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
          </>
        ) : (
          <>
            <div className="d-none d-md-block position-relative">
                <img src={`https://c1.scryfall.com/file/scryfall-cards/normal${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="card-img-top mt-3" data-bs-toggle="modal" data-bs-target={`#exampleModal-${cardId}`} />
            </div>
            <div className="d-block d-md-none position-relative">
                <img src={`https://c1.scryfall.com/file/scryfall-cards/small${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="card-img-top mt-3" data-bs-toggle="modal" data-bs-target={`#exampleModal-${cardId}`} />
            </div>
          </>
        )}
        <div className="card-body px-0">
          <p className="card-title fw-bold">{name} #{collectorNumber} {finish !== 'nonfoil' && `(${finish})`}</p>
          <p className="card-text m-0">Set: {setName} ({setCode.toUpperCase()})</p>
          <p className="card-text m-0">Rarity: {rarity}</p>
          {!finishes && <p className="card-text m-0">Price: {toDollars(price)}</p>}
          {user?.isAdmin && !finishes && <p className="card-text m-0">Quantity: {quantity}</p>}
        </div>
      </div>
      <div className="modal fade" id={`exampleModal-${cardId}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{name} #{collectorNumber} {finish !== 'nonfoil' && `(${finish})`}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <img src={`https://c1.scryfall.com/file/scryfall-cards/small${image}`} alt={`${name} #${collectorNumber}`} className="pb-2 d-block mx-auto" />
              <form className="form-inline mb-3 px-3" onSubmit={handleSubmit}>
                <label htmlFor="quantity-to-add" className="mr-3">Quantity:</label>
                <div className="input-group pb-2">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-outline-danger p-0"
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById('quantity-to-add');
                        const currentVal = parseInt(inputEl.value);
                        if (currentVal - 1 !== 0) {
                          inputEl.value = currentVal - 1;
                          setQuantityToAdd(inputEl.valueAsNumber);
                        }
                      }}
                    >
                      <AiOutlineMinusSquare size={40} />
                    </button>
                  </div>
                  <input
                    type="number"
                    id="quantity-to-add"
                    name="quantity-to-add"
                    value={quantityToAdd}
                    required
                    min={1}
                    onChange={handleQuantityToAddChange}
                    onFocus={event => event.target.select()}
                    className="form-control text-center" />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-success p-0"
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById('quantity-to-add');
                        const currentVal = parseInt(inputEl.value);
                        if (currentVal < 200) {
                          inputEl.value = currentVal + 1;
                          setQuantityToAdd(inputEl.valueAsNumber);
                        }
                      }}
                    >
                      <AiOutlinePlusSquare size={40} />
                    </button>
                  </div>
                </div>
                <label htmlFor="cost" className="mr-3">Price (cents):</label>
                <div className="input-group pb-2">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-outline-danger p-0"
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById('cost');
                        const currentVal = parseInt(inputEl.value);
                        if (currentVal - 1 !== -1) {
                          inputEl.value = currentVal - 1;
                          setCost(inputEl.valueAsNumber);
                        }
                      }}
                    >
                      <AiOutlineMinusSquare size={40} />
                    </button>
                  </div>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={cost}
                    required
                    min={0}
                    onChange={handleCostChange}
                    onFocus={event => event.target.select()}
                    className="form-control text-center" />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-success p-0"
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById('cost');
                        const currentVal = parseInt(inputEl.value);
                        if (currentVal < 1e8) {
                          inputEl.value = currentVal + 1;
                          setCost(inputEl.valueAsNumber);
                        }
                      }}
                    >
                      <AiOutlinePlusSquare size={40} />
                    </button>
                  </div>
                </div>
                {finishes && (
                  <>
                    <label htmlFor="card-finish" className="mr-3">Finish:</label>
                    <div className="input-group pb-4">
                      <select id="card-finish" className="form-select text-center" onChange={handleCardFinishChange}>
                        {finishes.split(', ').map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Add to Inventory</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
