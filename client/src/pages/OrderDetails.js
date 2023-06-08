import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { toDollars } from "../lib";
import { ShopContext } from '../components/ShopContext';

export default function OrderDetails(props) {
  const { state } = useLocation();
  const order = state;
  const [shipped, setShipped] = useState(order.shipped);
  const { user, handleToggleShipped } = useContext(ShopContext);

  const handleChange = () => {
    const newShipped = !shipped;
    handleToggleShipped(order.orderId, newShipped);
    setShipped(newShipped);
  }

  return (
    <div className="container">
      <h1 className="my-4 text-break">Order Details: {order.orderNumber}</h1>
      <div className="card mb-4">
        <div className="card-header">
          <h2>Order Summary</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-4">Order Number:</div>
            <div className="col-8">{order.orderNumber}</div>
          </div>
          <div className="row mb-3">
            <div className="col-4">Order Date:</div>
            <div className="col-8">{order.createdAt.substring(0, 10)}</div>
          </div>
          <div className="row mb-3">
            <div className="col-4">Ship To:</div>
            <div className="col-8">
              <div>{order.shippingName.toUpperCase()}</div>
              <div>{`${order.shippingAddress1}${order.shippingAddress2 && ' ' + order.shippingAddress2}`}</div>
              <div>{`${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}`}</div>
              <div>{`${order.shippingCountry}`}</div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">Shipping Cost:</div>
            <div className="col-8">{toDollars(order.shippingCost)}</div>
          </div>
          <div className="row mb-3">
            <div className="col-4">Total:</div>
            <div className="col-8">{toDollars(order.totalPrice)}</div>
          </div>
          <div className="row mb-3">
            <div className="col-4">Status:</div>
            <div className="col-8">
              {user.isAdmin ? (
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    checked={shipped}
                    onChange={handleChange}
                  />
                  Shipped
                </label>
              ) : (
                shipped ? 'Shipped' : 'Processing'
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header">
          <h2>Order Items</h2>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Card</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.cardId}>
                  <td>
                    <span className="d-block">{`${item.name}${item.finish !== 'nonfoil' ? ` (${item.finish})` : ''}`}</span>
                    <span className="d-block text-muted small">{`(${item.setCode.toUpperCase()}) #${item.collectorNumber}`}</span>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{toDollars(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
