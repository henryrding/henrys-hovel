import { Link } from 'react-router-dom';
import ToggleLamberto from '../components/ToggleLamberto';
import './NotFound.css';

export default function Orders() {
  return (
    <div className="Header-content">
      <div className="row">
        <div className="col text-center mb-5">
          <h3>THIS IS THE ORDERS PAGE!</h3>
          <ToggleLamberto />
          <p className="text-muted" style={{ textDecorationSkipInk: "none" }}>
            <Link to="/">Return to the catalog</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
