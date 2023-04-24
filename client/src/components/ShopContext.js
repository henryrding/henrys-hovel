import { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const [user, setUser] = useState();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [cartInventory, setCartInventory] = useState(
    !localStorage.getItem('cart') ? [] : JSON.parse(localStorage.getItem('cart'))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tokenKey');
    const user = token ? jwtDecode(token) : null;
    setUser(user);
    setIsAuthorizing(false);
  }, []);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart'));
    if (cartData) {
      setCartInventory(cartData);
    } else {
      setCartInventory([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartInventory));
  }, [cartInventory]);

  const handleSignIn = useCallback((result) => {
    const { user, token } = result;
    localStorage.setItem('tokenKey', token);
    setUser(user);
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('tokenKey');
    setUser(undefined);
    navigate('/')
  }, [navigate]);

  const addToCart = useCallback((inventoryId, quantity) => {
    const cartCard = {inventoryId: inventoryId, quantity:quantity};
    const updatedCartInventory = cartInventory.map(card => {
      if (card.inventoryId === inventoryId) {
        return {...card, quantity: card.quantity + quantity}
      } else {
        return card;
      }
    });
    const cardWithInventoryIdIndex = cartInventory.findIndex(card => card.inventoryId === inventoryId);
    if (cardWithInventoryIdIndex === -1) {
      updatedCartInventory.push(cartCard);
    }
    setCartInventory(updatedCartInventory);
  }, [cartInventory]);

  const removeFromCart = useCallback((inventoryId) => {
    const updatedCartInventory = cartInventory.filter(card => card.inventoryId !== inventoryId);
    setCartInventory(updatedCartInventory);
  }, [cartInventory]);

  const updateCartItemQuantity = useCallback((inventoryId, newQuantity) => {
    const updatedCartInventory = cartInventory.map(card => {
      if (card.inventoryId === inventoryId) {
        return { ...card, quantity: newQuantity }
      } else {
        return card;
      }
    });
    setCartInventory(updatedCartInventory);
  },[cartInventory]);

  const clearCart = useCallback(() => {
    setCartInventory([]);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    handleSignIn,
    handleSignOut,
    cartInventory,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  }), [user, handleSignIn, handleSignOut, cartInventory, addToCart, removeFromCart, updateCartItemQuantity, clearCart]);

  if (isAuthorizing) return null;

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
