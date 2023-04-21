import { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchCatalog } from '../lib';
import CartItem from "../components/CartItem.js";
import { ShopContext } from "../components/ShopContext";
import { toDollars } from "../lib";
import ToggleLamberto from "../components/ToggleLamberto"

export default function Cart() {
  const [inventory, setInventory] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const { cartInventory, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    let newSubtotal = 0;
    cartInventory.forEach(cartItem => {
      const inventoryItem = inventory.find(item => item.inventoryId === cartItem.inventoryId);
      if (inventoryItem) {
        newSubtotal += inventoryItem.price * cartItem.quantity;
      }
    });
    setSubtotal(newSubtotal);
  }, [cartInventory, inventory]);

  const filteredArray = inventory.filter(card => cartInventory.some(cartCard => cartCard.inventoryId === card.inventoryId));

  function handleQuantity(card) {
    const quantity = cartInventory.find(item => item.inventoryId === card.inventoryId)?.quantity;
    return quantity;
  }

  function handleCheckout() {
    console.log('I\'m checking out!');
  }

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
      {cartInventory.length === 0 ? (
        <>
          <div className="alert alert-info text-center mt-4" role="alert">
            Your cart is empty
          </div>
          <div className="d-flex justify-content-center">
            <ToggleLamberto />
          </div>
        </>
      ) : (
          <>
            <div className="row">
              <div className="col-md-8">
                {filteredArray.map((item) => (
                  <CartItem key={item.inventoryId} card={item} cartQuantity={handleQuantity(item)} />
                ))}
              </div>
              <div className="col-md-4">
                <h4 className="text-center mb-4">Cart Summary</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{toDollars(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax ({7.75}%):</span>
                  <span>{toDollars(subtotal * 0.0775)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span>Total:</span>
                  <span>{toDollars(subtotal + (subtotal * 0.0775))}</span>
                </div>
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
                  <button type="button" className="btn btn-danger" onClick={clearCart}>Clear cart</button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
              </div>
            </div>
          </>
      )}
    </div>
  );
}
