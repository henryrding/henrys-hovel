import { createContext, useEffect, useState } from 'react';

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

  const addToCart = (inventoryId, quantity) => {
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
  }

  const removeFromCart = (inventoryId) => {
    const updatedCartInventory = cartInventory.filter(card => card.inventoryId !== inventoryId);
    setCartInventory(updatedCartInventory);
  }

  const updadeCartItemQuantity = (inventoryId, newQuantity) => {
    const updatedCartInventory = cartInventory.map(card => {
      if (card.inventoryId === inventoryId) {
        return { ...card, quantity: newQuantity }
      } else {
        return card;
      }
    });
    setCartInventory(updatedCartInventory);
  };

  const clearCart = () => {
    setCartInventory([]);
  }

  const contextValue = {
    cartInventory,
    addToCart,
    removeFromCart,
    updadeCartItemQuantity,
    clearCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
