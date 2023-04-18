export async function fetchCatalog() {
  const res = await fetch(('/api/inventory'));
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
