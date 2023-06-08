import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ShopContext } from '../components/ShopContext';
import SpinningLogo from '../components/SpinningLogo';
import NotFound from './NotFound';
import { fetchCard, updateInventory, toDollars, italicizeReminderText, handleToast } from '../lib';
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import './CardDetails.css';

export default function CardDetails() {
  const { cardId, type } = useParams();
  const [card, setCard] = useState();
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [newPrice, setNewPrice] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const { addToCart, cartInventory, user } = useContext(ShopContext);

  useEffect(() => {
    async function loadProduct(cardId, type) {
      try {
        const card = await fetchCard(cardId, type);
        setCard(card);
        user?.isAdmin ? setQuantityToAdd(card.quantity) : setQuantityToAdd(1);
        setNewPrice(card.price);
        setIsVisible(card.visible);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    loadProduct(cardId, type);
  }, [cardId, type, user]);

  function handleQuantityChange(event) {
    const inputQuantity = parseInt(event.target.value);
    if (!isNaN(inputQuantity)) {
      setQuantityToAdd(inputQuantity);
    }
  }

  function handlePriceChange(event) {
    const inputPrice = parseInt(event.target.value);
    if (!isNaN(inputPrice)) {
      setNewPrice(inputPrice);
    }
  }

  function handleVisibleChange(event) {
    const inputVisible = event.target.value === "true";
    setIsVisible(!inputVisible);
  }

  function findCartCard(cartItems, item) {
    return cartItems.find(cartItem => cartItem.inventoryId === item.inventoryId)
  };

  function handleSubmit(event) {
    event.preventDefault();
    const cardInCart = findCartCard(cartInventory, card);
    if (cardInCart === undefined || !(cardInCart.quantity + quantityToAdd > card.quantity)) {
      addToCart(card.inventoryId, quantityToAdd)
    } else {
      handleToast();
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    try {
      const newCard = await updateInventory(cardId, quantityToAdd, newPrice, isVisible);
      setCard(newCard.updatedCard);
      handleToast();
    } catch (err) {
      setError(err);
    }
  }

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only visually-hidden">Loading...</span>
      </div>
    </div>
  );
  if (error) {
    return (
      <div className="container">
        <div className="alert alert-info text-center mt-4" role="alert">
          Error Loading Product {cardId}: {error.message}
        </div>
        <div className="text-center mb-5">
          <SpinningLogo />
          <p className="text-muted" style={{ textDecorationSkipInk: "none" }}>
            <Link to="/">Return to the catalog</Link>
          </p>
        </div>
      </div>
    );
  }
  if (!card) return null;
  const { name, collectorNumber, setName, setCode, rarity, finish, price, quantity, image, manaCost, typeLine, power, toughness, flavorText, artist, oracleText, visible } = card;

  const cardInCart = findCartCard(cartInventory, card);
  const cartItemAmount = cardInCart !== undefined && cardInCart.quantity;

  if (!visible && !user?.isAdmin) {
    return (
      <NotFound />
    )
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 p-4">
          <div className='position-relative d-inline-block'>
            <img src={`https://c1.scryfall.com/file/scryfall-cards/normal${image}`} alt={name} className="img-fluid max-wd-lg-40" />
            {quantity === 0 && <div className="card-img-overlay d-flex justify-content-center align-items-center position-absolute" style={{backgroundColor: 'gray', opacity: 0.5, borderRadius: "3.5%"}}>
              <h1 className="card-title">OUT OF STOCK</h1>
            </div>}
          </div>
        </div>
        <div className="col-md-6 p-4">
          <div className="card">
            <div className="card-header d-flex align-items-center">
              <h3 className="card-title d-inline m-0">{name}</h3>
              <span className="mx-2 d-inline"></span>
              <h5 className="card-subtitle text-muted d-inline m-0 text-nowrap">{manaCost}</h5>
            </div>
            <div className="card-body">
              <p className="card-text"><strong>Type:</strong> {typeLine}</p>
              <p className="card-text"><strong>Set Name:</strong> {setName} ({setCode.toUpperCase()})</p>
              <p className="card-text"><strong>Rarity:</strong> {rarity}</p>
              <p className="card-text" style={{ whiteSpace: "pre-line" }}><strong>Oracle Text:</strong> {italicizeReminderText(oracleText)}</p>
              <p className="card-text" style={{ whiteSpace: "pre-line" }}>
                <strong>Flavor Text:</strong>{" "}
                <em>
                  {flavorText
                    .split('*')
                    .map((text, index) => (index % 2 === 0 ? text : <span key={index} style={{ fontStyle: "normal" }}>{text}</span>))}
                </em>
              </p>
              <p className="card-text"><strong>Power/Toughness:</strong> {power}/{toughness}</p>
              <p className="card-text"><strong>Artist:</strong> {artist}</p>
              <p className="card-text"><strong>Collector Number:</strong> {collectorNumber}</p>
              <p className="card-text"><strong>Finish:</strong> {finish}</p>
              <p className="card-text"><strong>Price:</strong> {toDollars(price)}</p>
              <p className="card-text"><strong>Quantity Available:</strong> {quantity === 0 ? 'OUT OF STOCK' : quantity}</p>
            </div>
            {user?.isAdmin ?
            <form onSubmit={handleUpdate} className="form-inline mb-3 px-3">
              <label htmlFor="price" className="mr-3">
                Price:
              </label>
              <div className="input-group pb-4">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-outline-danger p-0"
                    type="button"
                    id="button-addon3"
                    onClick={() => {
                      if (newPrice > 0) {
                        setNewPrice(newPrice - 1);
                      }
                    }}
                  >
                    <AiOutlineMinusSquare size={40} />
                  </button>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newPrice}
                  required
                  min={0}
                  onChange={handlePriceChange}
                  onFocus={event => event.target.select()}
                  className="form-control text-center"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-success p-0"
                    type="button"
                    id="button-addon4"
                    onClick={() => {
                      if (newPrice < 1e8) {
                        setNewPrice(newPrice + 1);
                      }
                    }}
                  >
                    <AiOutlinePlusSquare size={40} />
                  </button>
                </div>
              </div>
              <label htmlFor="quantity" className="mr-3">
                Quantity:
              </label>
              <div className="input-group pb-4">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-outline-danger p-0"
                    type="button"
                    id="button-addon1"
                    onClick={() => {
                      if (quantityToAdd > 0) {
                        setQuantityToAdd(quantityToAdd - 1);
                      }
                    }}
                  >
                    <AiOutlineMinusSquare size={40} />
                  </button>
                </div>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantityToAdd}
                  required
                  min={0}
                  max={200}
                  onChange={handleQuantityChange}
                  onFocus={event => event.target.select()}
                  className="form-control text-center"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-success p-0"
                    type="button"
                    id="button-addon2"
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
              <div className="form-check form-switch pb-4">
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
              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn btn-primary" id="liveToastBtn">
                  Update Card Qualities
                </button>
                <Link to="/"><button className="btn btn-link">Back to Catalog</button></Link>
              </div>
            </form>
          :(<form onSubmit={handleSubmit} className="form-inline mb-3 px-3">
              <label htmlFor="quantity" className="mr-3">
                Quantity:
              </label>
              <div className="input-group pb-4">
                <div className="input-group-prepend">
                  <button
                    className="btn btn-outline-danger p-0"
                    type="button"
                    id="button-addon1"
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
                  id="quantity"
                  name="quantity"
                  value={quantityToAdd}
                  required
                  min={1}
                  max={quantity}
                  onChange={handleQuantityChange}
                  onFocus={event => event.target.select()}
                  className="form-control text-center"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-success p-0"
                    type="button"
                    id="button-addon2"
                    onClick={() => {
                      if (quantityToAdd < quantity) {
                        setQuantityToAdd(quantityToAdd + 1);
                      }
                    }}
                  >
                    <AiOutlinePlusSquare size={40} />
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn btn-primary" id="liveToastBtn" onClick={quantity === 0 ? handleToast : undefined}>
                  Add to Cart {cartItemAmount > 0 && <>({cartItemAmount})</>}
                </button>
                <Link to="/"><button className="btn btn-link">Back to Catalog</button></Link>
              </div>
            </form>)}
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            {user?.isAdmin ? <BiCheckCircle color='green' className="rounded me-2" /> : <BiErrorCircle color='red' className="rounded me-2" />}
              <strong className="me-auto">Henry's Hovel</strong>
              <small>Just now</small>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {user?.isAdmin ? (card.finishes ? 'Added to Inventory!' : 'Updated!') :'Not enough in stock!'}
          </div>
        </div>
      </div>
    </div>
  );
};
