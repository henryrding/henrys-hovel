import { Link } from 'react-router-dom';
import SpinningLogo from '../components/SpinningLogo';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="Header-content">
      <div className="row gx-0">
        <div className="col text-center mb-5">
          <h3 className="my-4">Uh oh, we could not find the page you were looking for!</h3>
          <SpinningLogo />
          <p className="text-muted" style={{ textDecorationSkipInk: "none" }}>
            <Link to="/">Return to the catalog</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
