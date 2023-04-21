import { createContext, useEffect, useState, useCallback, useMemo } from 'react';

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const [cartInventory, setCartInventory] = useState(
    !localStorage.getItem('cart') ? [] : JSON.parse(localStorage.getItem('cart'))
  );

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
    console.log(updatedCartInventory);
    setCartInventory(updatedCartInventory);
  },[cartInventory]);

  const clearCart = useCallback(() => {
    setCartInventory([]);
  }, []);

  const contextValue = useMemo(() => ({
    cartInventory,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  }), [cartInventory, addToCart, removeFromCart, updateCartItemQuantity, clearCart]);

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
