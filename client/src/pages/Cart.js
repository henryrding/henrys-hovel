import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiErrorCircle } from 'react-icons/bi';
import { fetchCatalog, toDollars, handleToast } from '../lib';
import CartItem from "../components/CartItem.js";
import { ShopContext } from "../components/ShopContext";
import SpinningLogo from "../components/SpinningLogo";
import './Cart.css';

export default function Cart() {
  const [inventory, setInventory] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const { cartInventory, clearCart, user } = useContext(ShopContext);
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

  function handleClick(event) {
    event.preventDefault();
    handleToast();
  }

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only visually-hidden">Loading...</span>
      </div>
    </div>
  );
  if (error) return (
    <div className="container">
      <div className="alert alert-info text-center mt-4" role="alert">
        Error Loading Catalog: {error.message}
      </div>
      <div className="d-flex justify-content-center">
        <SpinningLogo />
      </div>
    </div>
  );

  return (
    <div className="container">
      {cartInventory.length === 0 ? (
        <>
          <div className="alert alert-info text-center mt-4" role="alert">
            Your cart is empty
          </div>
          <div className="d-flex justify-content-center">
            <SpinningLogo />
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
              <div className="col-md-4 pt-md-4">
                <div className="row card mx-4" id="cart-summary">
                  <h4 className="text-center mb-4 card-header border">Cart Summary</h4>
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
                  <div className="d-grid gap-2 pb-4">
                    {user && subtotal >= 50 &&
                      <form action={`/create-checkout-session/${user.userId}`} method="POST">
                        <button type="submit" className="btn btn-primary w-100">
                          Checkout
                        </button>
                      </form>}
                    {!user &&
                      <button type="button" className="btn btn-primary" onClick={() => navigate('/sign-in')}>
                        Sign in to checkout!
                      </button>}
                    {user && subtotal < 50 &&
                      <button type="button" className="btn btn-primary" id="liveToastBtn" onClick={handleClick}>
                        Checkout
                      </button>}
                    <button type="button" className="btn btn-danger" onClick={clearCart}>Clear cart</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Continue Shopping</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
              <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                  <BiErrorCircle color='red' className="rounded me-2" />
                  <strong className="me-auto">Henry's Hovel</strong>
                  <small>Just now</small>
                  <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                  Subtotal must be $0.50 or more!
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}
