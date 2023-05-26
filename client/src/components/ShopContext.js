import { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { fetchCartInventory, clearCartInventory, addCartInventory, deleteCartInventory, updateCartInventory, fetchOrderItems, updateOrderStatus } from '../lib';

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const [user, setUser] = useState();
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [cartInventory, setCartInventory] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tokenKey');
    const user = token ? jwtDecode(token) : null;
    setUser(user);
    setIsAuthorizing(false);
  }, []);

  useEffect(() => {
    async function getCartData() {
      if (user && !user.isAdmin) {
        try {
          const data = await fetchCartInventory();
          setCartInventory(data);
        } catch (err) {
          console.error(err);
        }
      }
      if (!user) {
        const cartData = JSON.parse(localStorage.getItem('cart'));
        if (cartData && cartData.length > 0) {
          setCartInventory(cartData);
        }
      }
      setIsAuthorizing(false);
    }
    getCartData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartInventory));
  }, [cartInventory]);

  useEffect(() => {
    async function getOrderItems() {
      if (user) {
        try {
          const data = await fetchOrderItems();
          setOrderItems(data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setOrderItems([]);
      }
    }
    getOrderItems();
    setIsAuthorizing(false);
  }, [user]);

  const handleSignIn = useCallback(async (result) => {
    const { user, token } = result;
    localStorage.setItem('tokenKey', token);
    setUser(user);
    const cartData = JSON.parse(localStorage.getItem('cart'));
    if (!user.isAdmin) {
      try {
        if (cartData.length === 0) {
          const oldInventory = await fetchCartInventory();
          setCartInventory(oldInventory);
        } else {
          await clearCartInventory();
          for (const { inventoryId, quantity } of cartData) {
            await addCartInventory(inventoryId, quantity);
          }
          const newInventory = await fetchCartInventory();
          setCartInventory(newInventory);
          localStorage.removeItem('cart');
        }
      } catch (err) {
        console.error(err.message)
      }
    } else {
      localStorage.removeItem('cart');
    }
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('tokenKey');
    localStorage.removeItem('cart');
    setUser(undefined);
    setCartInventory([]);
    setOrderItems([]);
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
    if (user) {
      try {
        await deleteCartInventory(inventoryId);
      } catch (err) {
        console.error(err);
      }
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

  const handleToggleShipped = useCallback(async (orderId, shipped) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, shipped);
      setOrderItems((prev) =>
        prev.map((orderItem) =>
          orderItem.orderId === orderId ? { ...orderItem, shipped: updatedOrder.shipped } : orderItem
        )
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    handleSignIn,
    handleSignOut,
    cartInventory,
    orderItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    handleToggleShipped
  }), [user, handleSignIn, handleSignOut, cartInventory, orderItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart, handleToggleShipped]);

  if (isAuthorizing) return null;

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
