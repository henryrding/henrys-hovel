import { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { ShopContext } from "../components/ShopContext";
import SpinningLogo from "../components/SpinningLogo";

export default function Orders() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, orderItems } = useContext(ShopContext);

  useEffect(() => {
    setIsLoading(orderItems.length === 0);
  }, [orderItems]);

  const pendingOrderItems = orderItems.filter(order => order.shipped === false);
  const completedOrderItems = orderItems.filter(order => order.shipped);

  const pendingOrders = pendingOrderItems.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.orderId === curr.orderId);
    if (index === -1) {
      acc.unshift({ orderId: curr.orderId,
                 orderNumber: curr.orderNumber,
                 totalPrice: curr.totalPrice,
                 shippingName: curr.shippingName,
                 shippingAddress1: curr.shippingAddress1,
                 shippingAddress2: curr.shippingAddress2,
                 shippingCity: curr.shippingCity,
                 shippingState: curr.shippingState,
                 shippingCountry: curr.shippingCountry,
                 shippingPostalCode: curr.shippingPostalCode,
                 shippingCost: curr.shippingCost,
                 shipped: curr.shipped,
                 createdAt: curr.createdAt,
                 items: [curr] });
    } else {
      acc[index].items.push(curr);
    }
    return acc;
  }, []);

  const completedOrders = completedOrderItems.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.orderId === curr.orderId);
    if (index === -1) {
      acc.unshift({ orderId: curr.orderId,
                 orderNumber: curr.orderNumber,
                 totalPrice: curr.totalPrice,
                 shippingName: curr.shippingName,
                 shippingAddress1: curr.shippingAddress1,
                 shippingAddress2: curr.shippingAddress2,
                 shippingCity: curr.shippingCity,
                 shippingState: curr.shippingState,
                 shippingCountry: curr.shippingCountry,
                 shippingPostalCode: curr.shippingPostalCode,
                 shippingCost: curr.shippingCost,
                 shipped: curr.shipped,
                 createdAt: curr.createdAt,
                 items: [curr] });
    } else {
      acc[index].items.push(curr);
    }
    return acc;
  }, []);

  return (
    <div className="container">
      <h1 className="my-4">Order History</h1>
      {!user ? (
        <>
          <div className="alert alert-info text-center mt-4" role="alert">
            You must be signed in to view orders!
          </div>
          <div className="d-flex justify-content-center">
            <SpinningLogo />
          </div>
        </>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h2>Pending Orders</h2>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (pendingOrders.length === 0 ? (
                  <div className="alert alert-info text-center mt-4" role="alert">
                    No pending orders
                  </div>
                  ) : pendingOrders.map((order) => (
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" key={order.orderId}>
                      <div className="text-break col-4 col-md-7 col-lg-8">{order.orderNumber}</div>
                      <div>{order.createdAt.substring(0, 10)}</div>
                      <Link to={`/orderDetails/${order.orderNumber}`} state={order}>
                        <button className="btn btn-primary">Order Details</button>
                      </Link>
                    </div>
                  ))
                )}
            </div>
          </div>
            <div className="card mb-4">
              <div className="card-header">
                <h2>Completed Orders</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {completedOrders.length === 0 ? (
                      <div className="alert alert-info text-center mt-4" role="alert">
                        No orders found
                      </div>
                    ) : (
                      completedOrders.map((order) => (
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" key={order.orderId}>
                          <div className="text-break col-4 col-md-7 col-lg-8">{order.orderNumber}</div>
                          <div>{order.createdAt.substring(0, 10)}</div>
                          <Link to={`/orderDetails/${order.orderNumber}`} state={order}>
                            <button className="btn btn-primary">Order Details</button>
                          </Link>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
        </>)}
    </div>
  );
}
