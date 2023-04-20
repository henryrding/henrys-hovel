// import { useEffect, useState } from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import { ShopContextProvider } from './components/ShopContext';
import Catalog from './pages/Catalog';
import CardDetails from './pages/CardDetails';
// import Cart from './pages/Cart';
// import Auth from './pages/AuthPage';
// import Inventory from './pages/Inventory';
// import Orders from './pages/Orders';
// import OrderDetails from './pages/OrderDetails';
import NotFound from './pages/NotFound';

function App() {
  // const [serverData, setServerData] = useState("");

  // useEffect(() => {
  //   async function getServerData() {
  //     const resp = await fetch('/api/hello');
  //     const data = await resp.json();

  //     console.log('Data from server:', data);

  //     setServerData(data.message);
  //   }

  //   getServerData();
  // }, []);


  return(
    <ShopContextProvider>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Catalog />} />
          <Route path="details/:cardId" element={<CardDetails />} />
          {/* <Route path="sign-in" element={<Auth action="sign-in" />} />
          <Route path="sign-up" element={<Auth action="sign-up" />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orderDetails/:orderNumber" element={<OrderDetails />} />
          <Route path="inventory" element={<Inventory />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ShopContextProvider>
  );
}

export default App;
