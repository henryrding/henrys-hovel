export default function getTotalQuantity(cartInventory) {
  return cartInventory.reduce((total, item) => total + item.quantity, 0);
}
