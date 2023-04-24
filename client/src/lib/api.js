export async function fetchCatalog() {
  const res = await fetch(('/api/inventory'));
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function fetchCard(cardId) {
  const res = await fetch(`/api/inventory/${cardId}`);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function signUpOrIn(action, username, password, firstName, lastName, email) {
  let body = { username, password, firstName, lastName, email };
  if (action === 'sign-in') {
    body = { username, password };
  }
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(`/api/auth/${action}`, req)
  if (!res.ok) {
    const message = await res.text(res.body)
    throw new Error(`${message.substring(10, message.length - 2)}`);
  }
  return await res.json();
}
