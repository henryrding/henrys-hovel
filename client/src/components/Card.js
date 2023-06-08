import { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { addToInventory ,toDollars } from '../lib';
import { ShopContext } from "../components/ShopContext";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai';
import "./Card.css";

export default function Card({ card }) {
  const { name, collectorNumber, setName, setCode, rarity, finishes, finish, price, quantity, cardId, image } = card;
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [cost, setCost] = useState(0);
  const [cardFinish, setCardFinish] = useState(finish);
  const [isVisible, setIsVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState();
  const [error, setError] = useState();
  const formRef = useRef(null);
  const { user } = useContext(ShopContext);

  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  useEffect(() => {
    const myModalEl = document.getElementById(`exampleModal-${cardId}`);
    const handleModalHide = () => {
      setQuantityToAdd(1);
      setCost(0);
      setCardFinish(finish);
      setIsVisible(false);
      setSuccessMessage();
      setError();
      formRef.current.reset();
    }
    myModalEl.addEventListener('hidden.bs.modal', handleModalHide);
    return () => {
      myModalEl.removeEventListener('hidden.bs.modal', handleModalHide);
    }
  }, [cardId, finish]);


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

  function handleVisibleChange(event) {
    const inputVisible = event.target.value === "true";
    setIsVisible(!inputVisible);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSuccessMessage('...');
      await addToInventory(card, quantityToAdd, cost, cardFinish, isVisible);
      setError();
      setSuccessMessage('Successfully added to inventory.');
    } catch (err) {
      setSuccessMessage('');
      setError(err);
    }
  }

  return (
    <>
      <div className={`card mx-0 ${isHovered ? 'hovered' : ''}`}>
        {!finishes ? (
          <>
            <Link className="d-none d-md-block position-relative" to={`/details/${cardId}/${finish}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <img src={`https://c1.scryfall.com/file/scryfall-cards/normal${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="card-img-top mt-3" />
              {quantity === 0 && <div className="card-img-overlay d-flex justify-content-center align-items-center mt-3" style={{ backgroundColor: 'gray', opacity: 0.5, borderRadius: "3.5%" }}>
                <h1 className="card-title text-center" style={{ color: 'black' }}>OUT OF STOCK</h1>
              </div>}
            </Link>
            <Link className="d-block d-md-none position-relative" to={`/details/${cardId}/${finish}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <img src={`https://c1.scryfall.com/file/scryfall-cards/small${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="card-img-top mt-3" />
              {quantity === 0 && <div className="card-img-overlay d-flex justify-content-center align-items-center mt-3" style={{ backgroundColor: 'gray', opacity: 0.5, borderRadius: "3.5%" }}>
                <h1 className="card-title text-center" style={{ color: 'black' }}>OUT OF STOCK</h1>
              </div>}
            </Link>
          </>
        ) : (
          <>
              <div className="d-none d-md-block position-relative" role="button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img src={`https://c1.scryfall.com/file/scryfall-cards/normal${image}`} alt={`${name} #${collectorNumber} ${finish !== 'nonfoil' && `(${finish})`}`} className="card-img-top mt-3" data-bs-toggle="modal" data-bs-target={`#exampleModal-${cardId}`} />
            </div>
              <div className="d-block d-md-none position-relative" role="button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
        {user?.isAdmin && finishes && (<div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{name} #{collectorNumber} {finish !== 'nonfoil' && `(${finish})`}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <img src={`https://c1.scryfall.com/file/scryfall-cards/small${image}`} alt={`${name} #${collectorNumber}`} className="pb-2 d-block mx-auto" />
              <form className="form-inline mb-3 px-3" onSubmit={handleSubmit} ref={formRef}>
                <label htmlFor="quantity-to-add" className="mr-3">Quantity:</label>
                <div className="input-group pb-2">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-outline-danger p-0"
                      type="button"
                      onClick={() => {
                        if (quantityToAdd > 1) {
                          setQuantityToAdd(quantityToAdd - 1);
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
                        if (quantityToAdd < 200) {
                          setQuantityToAdd(quantityToAdd + 1);
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
                        if (cost > 0) {
                          setCost(cost - 1);
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
                        if (cost < 1e8) {
                          setCost(cost + 1);
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
                      <select id="card-finish" className="form-select text-center" role="button" onChange={handleCardFinishChange}>
                        {finishes.split(', ').map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div className={`form-check form-switch ${!error && !successMessage && " pb-4"}`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="available"
                    checked={isVisible}
                    value={isVisible}
                    role="button"
                    onChange={handleVisibleChange}
                  />
                  <label className="form-check-label" htmlFor="available">
                    Visible
                  </label>
                </div>
                {error && !successMessage && <div style={{ color: 'red' }}>Error: {error.message}</div>}
                {successMessage && !error && <div style={{ color: 'green' }}>{successMessage}</div>}
                <div className="d-flex justify-content-between align-items-center">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Add to Inventory</button>
                </div>
              </form>
            </div>
          </div>
        </div>)}
      </div>
    </>
  );
}
