import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchCard, toDollars, createLineBreaks } from '../lib';
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai';
import './CardDetails.css';

export default function CardDetails() {
  const { cardId } = useParams();
  const [card, setCard] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    async function loadProduct(cardId) {
      try {
        const card = await fetchCard(cardId);
        setCard(card);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    loadProduct(cardId);
  }, [cardId]);

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only visually-hidden">Loading...</span>
      </div>
    </div>
  );
  if (error) {
    return (
      <div>
        Error Loading Product {cardId}: {error.message}
      </div>
    );
  }
  if (!card) return null;
  const { name, collectorNumber, setName, setCode, rarity, foil, price, quantity, image, manaCost, typeLine, power, toughness, flavorText, artist } = card;
  let { oracleText } = card;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 p-4">
          <img src={`https://c1.scryfall.com/file/scryfall-cards/normal${image}`} alt="Card Name" className="img-fluid max-wd-lg-40" />
        </div>
        <div className="col-md-6 p-4">
          <div className="card">
            <div className="card-header d-flex align-items-center">
              <h3 className="card-title d-inline m-0">{name}</h3>
              <span className="mx-2 d-inline"></span>
              <h5 className="card-subtitle text-muted d-inline m-0">{manaCost}</h5>
            </div>
            <div className="card-body">
              <p className="card-text"><strong>Type:</strong> {typeLine}</p>
              <p className="card-text"><strong>Set Name:</strong> {setName} ({setCode.toUpperCase()})</p>
              <p className="card-text"><strong>Rarity:</strong> {rarity}</p>
              <p className="card-text"><strong>Oracle Text:</strong> {createLineBreaks(oracleText)}</p>
              <p className="card-text"><strong>Flavor Text:</strong> <em>{flavorText.replaceAll('\\"', '"')}</em></p>
              <p className="card-text"><strong>Power/Toughness:</strong> {power}/{toughness}</p>
              <p className="card-text"><strong>Artist:</strong> {artist}</p>
              <p className="card-text"><strong>Collector Number:</strong> {collectorNumber}</p>
              <p className="card-text"><strong>Finish:</strong> {foil ? 'foil' : 'nonfoil'}</p>
              <p className="card-text"><strong>Price:</strong> {toDollars(price)}</p>
              <p className="card-text"><strong>Quantity Available:</strong> {quantity}</p>
            </div>
            <form className="form-inline mb-3 px-3">
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
                      const inputEl = document.getElementById('quantity');
                      const currentVal = parseInt(inputEl.value);
                      if (!isNaN(currentVal) && currentVal - 1 !== 0) {
                        inputEl.value = currentVal - 1;
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
                  defaultValue={1}
                  className="form-control text-center"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-success p-0"
                    type="button"
                    id="button-addon2"
                    onClick={() => {
                      const inputEl = document.getElementById('quantity');
                      const currentVal = parseInt(inputEl.value);
                      if (!isNaN(currentVal) && currentVal < quantity) {
                        inputEl.value = currentVal + 1;
                      }
                    }}
                  >
                    <AiOutlinePlusSquare size={40} />
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-primary">Add to Cart</button>
                <Link to="/"><button className="btn btn-link">Back to Catalog</button></Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
