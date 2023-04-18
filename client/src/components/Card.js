import { Link } from 'react-router-dom';

export default function Card() {
  return (
    <div className="card mx-auto max-w-sm max-w-md max-w-lg">
      <Link to="/"><img src="https://c1.scryfall.com/file/scryfall-cards/large/front/d/3/d32b3637-ffc8-4bda-bfc1-912f5789b5ed.jpg?1675830355" alt="Goblin King (foil) 7th Edition" className="card-img-top mt-3" /></Link>
      <div className="card-body">
        <p className="card-title fw-bold">Goblin King (foil)</p>
        <p className="card-text m-0">Set: 7th Edition</p>
        <p className="card-text m-0">Rarity: Rare</p>
        <p className="card-text m-0">Price: $15.99</p>
      </div>
    </div>
  );
}
