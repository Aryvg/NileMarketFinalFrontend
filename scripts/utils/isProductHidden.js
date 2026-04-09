// Utility to check if a product is hidden
// Returns a Promise<boolean>
export async function isProductHidden(productName) {
  try {
    // Try to get access token via /refresh (cookies included)
    let token = null;
    try {
      const r = await fetch('https://nilemarketfinalbackend.onrender.com/refresh', { credentials: 'include' });
      if (r.ok) {
        const d = await r.json();
        token = d?.accessToken || null;
        if (token) localStorage.setItem('accessToken', token);
      }
    } catch (e) {
      // fallback to local token
    }
    if (!token) token = localStorage.getItem('accessToken');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
    // Search product by name (exact match)
    const resp = await fetch(`https://nilemarketfinalbackend.onrender.com/products?name=${encodeURIComponent(productName)}&showHidden=1`, { headers });
    if (!resp.ok) return false;
    const products = await resp.json();
    if (!Array.isArray(products)) return false;
    // Find the product with exact name
    const prod = products.find(p => p.name === productName);
    return !!(prod && prod.hidden);
  } catch (e) {
    return false;
  }
}
