import { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { fetchCartInventory, clearCartInventory, addCartInventory, deleteCartInventory, updateCartInventory } from '../lib';

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const [user, setUser] = useState();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [cartInventory, setCartInventory] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('tokenKey');
    const user = token ? jwtDecode(token) : null;
    setUser(user);
    setIsAuthorizing(false);
  }, []);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart'));
    if (cartData.length > 0) {
      setCartInventory(cartData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartInventory));
  }, [cartInventory]);

  const handleSignIn = useCallback(async (result) => {
    const { user, token } = result;
    localStorage.setItem('tokenKey', token);
    setUser(user);
    const cartData = JSON.parse(localStorage.getItem('cart'));
    try {
      const oldInventory = await fetchCartInventory();
      if (cartData.length === 0) {
        setCartInventory(oldInventory);
      } else {
        await clearCartInventory();
        for (const { inventoryId, quantity } of cartData) {
          await addCartInventory(inventoryId, quantity);
        }
        const newInventory = await fetchCartInventory();
        setCartInventory(newInventory);
      }
    } catch (err) {
      console.error(err.message)
    }
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('tokenKey');
    localStorage.removeItem('cart');
    setUser(undefined);
    setCartInventory([]);
    navigate('/')
  }, [navigate]);

  const addToCart = useCallback(async (inventoryId, quantity) => {
    try {
      const existingCartItem = cartInventory.find(item => item.inventoryId === inventoryId);
      if (existingCartItem) {
        const updatedCartItem = { ...existingCartItem, quantity: existingCartItem.quantity + quantity };
        const updatedCartInventory = cartInventory.map(item => item.inventoryId === inventoryId ? updatedCartItem : item);
        user && await updateCartInventory(inventoryId, updatedCartItem.quantity);
        setCartInventory(updatedCartInventory);
      } else {
        const newCartItem = { inventoryId, quantity };
        const updatedCartInventory = [...cartInventory, newCartItem];
        user && await addCartInventory(inventoryId, quantity);
        setCartInventory(updatedCartInventory);
      }
    } catch (err) {
      console.error(err);
    }
  }, [cartInventory, user]);

  const removeFromCart = useCallback(async (inventoryId) => {
    const updatedCartInventory = cartInventory.filter(card => card.inventoryId !== inventoryId);
    setCartInventory(updatedCartInventory);
    try {
      user && await deleteCartInventory(inventoryId);
    } catch (err) {
      console.error(err);
    }
  }, [cartInventory, user]);

  const updateCartItemQuantity = useCallback(async (inventoryId, newQuantity) => {
    const updatedCartInventory = cartInventory.map(card => {
      if (card.inventoryId === inventoryId) {
        return { ...card, quantity: newQuantity }
      } else {
        return card;
      }
    });
    setCartInventory(updatedCartInventory);
    try {
      user && await updateCartInventory(inventoryId, newQuantity);
    } catch (err) {
      console.error(err);
    }
  },[cartInventory, user]);

  const clearCart = useCallback(async () => {
    setCartInventory([]);
    try {
      user && await clearCartInventory();
    } catch (err) {
      console.error(err);
    }
  }, [user]);

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
