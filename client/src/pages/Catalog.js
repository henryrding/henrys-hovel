import Card from "../components/Card";
import Search from "../components/Search";

export default function Catalog() {
  return (
    <div className="container">
      <Search />
      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
