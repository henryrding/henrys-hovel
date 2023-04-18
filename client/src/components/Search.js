import { CiSearch } from 'react-icons/ci'
import './Search.css';

export default function Search() {

  return (
    <div className="search input-group my-1 my-md-2 my-lg-3">
      <span className="input-group-text" ><CiSearch size={36} color="white" /></span>
      <input className="form-control" type="text" placeholder="Search" />
    </div>
  );
}
