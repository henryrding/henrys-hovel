import { useLocation } from "react-router-dom";
import { toDollars } from "../lib";

export default function OrderDetails(props) {
  const { state } = useLocation();
  const order = state;

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
            <div className="col-4">Shipped To:</div>
            <div className="col-8">
              <div>{order.shippingName}</div>
              <div>{order.shippingAddress}</div>
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
