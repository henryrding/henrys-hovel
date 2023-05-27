import { useContext } from 'react';
import {Link, Outlet} from 'react-router-dom';
import { ShopContext } from './ShopContext';
import { getTotalQuantity } from '../lib';
import {FaShieldAlt, FaUser, FaShoppingCart, FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import { BsDatabaseFillAdd } from 'react-icons/bs';
import './NavBar.css';

export default function NavBar() {
  const {user, handleSignOut, cartInventory} = useContext(ShopContext);

  return (
    <>
      <nav className="navbar navbar-expand bg-red sticky-top border-bottom border-3 border-dark">
        <div className="container-fluid px-md-5">
          <Link className="text-light navbar-brand active text-center fs-4 py-0" aria-current="page" to="/">
            <span className="d-block fw-bold">Henry's</span>
            <span className="d-block fw-bold">Hovel</span>
          </Link>
          <div className="" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {!user?.isAdmin && <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  <FaUser size={36} />
                  <span className="d-none d-md-inline ms-2 fw-semibold">My Orders</span>
                </Link>
              </li>}
              {user?.isAdmin && <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  <FaShieldAlt size={36} />
                  <span className="d-none d-md-inline ms-2 fw-semibold">Admin Tools</span>
                </Link>
              </li>}
              {!user && <li className="nav-item">
                <Link className="nav-link" to="/sign-in">
                  <FaSignInAlt size={36} />
                  <span className="d-none d-md-inline ms-2 fw-semibold">Sign In</span>
                </Link>
              </li>}
              {user && <li className="nav-item">
                <button className="nav-link btn" onClick={handleSignOut}>
                  <FaSignOutAlt size={36} />
                  <span className="d-none d-md-inline ms-2 fw-semibold">Sign Out</span>
                </button>
              </li>}
              {!user?.isAdmin && <li className="nav-item">
                <Link className="nav-link position-relative" to="/cart">
                  <FaShoppingCart size={36} />
                  {cartInventory.length > 0 && (
                  <span className="position-absolute top-1 start-75 translate-middle badge rounded-pill bg-danger">
                    {getTotalQuantity(cartInventory)}
                    <span className="visually-hidden">unread messages</span>
                  </span>)}
                  <span className="d-none d-md-inline ms-2 fw-semibold">Cart</span>
                </Link>
              </li>}
              {user?.isAdmin && <li className="nav-item">
                <Link className="nav-link" to="/add-inventory">
                  <BsDatabaseFillAdd size={36} />
                  <span className="d-none d-md-inline ms-2 fw-semibold">Add Inventory</span>
                </Link>
              </li>}
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
