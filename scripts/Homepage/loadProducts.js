import { formatCurrencyFromCents } from '../utils/formatPrice.js';

let productSkip = 0;
const productLimit = 8;
let allLoaded = false;
let loading = false;

function showSkeletons(count = 8) {
  const main = document.querySelector('.js-main');
  if (!main) return;
  let skeletons = '';
  for (let i = 0; i < count; i++) {
    skeletons += `
      <div class="skeleton-product-container">
        <div class="skeleton-image">
          <div class="skeleton-shimmer"></div>
        </div>
        <div class="skeleton-details">
          <div class="skeleton-line"><div class="skeleton-shimmer"></div></div>
          <div class="skeleton-line short"><div class="skeleton-shimmer"></div></div>
          <div class="skeleton-line"><div class="skeleton-shimmer"></div></div>
        </div>
      </div>
    `;
  }
  main.innerHTML = skeletons;
}
function removeSkeletons() {
  const main = document.querySelector('.js-main');
  if (!main) return;
  main.querySelectorAll('.skeleton-product-container').forEach(el => el.remove());
}

export async function loadProducts(initial = false) {
    if (loading || allLoaded) return;
    loading = true;
    if (initial) showSkeletons(productLimit);
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
        console.warn('Refresh failed, falling back to local token', e);
      }
      if (!token) token = localStorage.getItem('accessToken');
      const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
      const response = await fetch(`https://nilemarketfinalbackend.onrender.com/products?skip=${productSkip}&limit=${productLimit}`, { headers });
      if (!response.ok) {
        if (initial) removeSkeletons();
        if (initial) document.querySelector('.js-main').innerHTML = '<p style="color:#a00">Failed to load products. Check console.</p>';
        loading = false;
        return;
      }
      const products = await response.json();
      if (!Array.isArray(products) || products.length === 0) {
        allLoaded = true;
        if (initial) removeSkeletons();
        loading = false;
        return;
      }
      let container = '';
      products.forEach((product) => {
        container += `
         <div class="product-container">
        <div class="image-container">
          <div class="product-image">
          <img src="${product.image}">
          </div>
        </div>
        <div class="product-description">
           <div class="product-name">
              ${product.name}
           </div>
           <div class="product-price">
             $${formatCurrencyFromCents(product.priceCents)}
           </div>
           <div class="Quantity-selection">
             <select>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
             </select>
             <button class="add-to-cart js-add-to-cart-btn">Add-to-cart</button>
           </div>
        </div>
       </div>
        `;
      });
      if (initial) {
        removeSkeletons();
        document.querySelector('.js-main').innerHTML = container;
      } else {
        document.querySelector('.js-main').insertAdjacentHTML('beforeend', container);
      }
      productSkip += products.length;
      if (products.length < productLimit) allLoaded = true;
    } catch (error) {
      if (initial) removeSkeletons();
      if (initial) document.querySelector('.js-main').innerHTML = '<p style="color:white;">Opps, no products are uploaded</p>'
    } finally {
      loading = false;
    }
}

// Lazy load on scroll
window.addEventListener('scroll', () => {
  if (allLoaded || loading) return;
  const main = document.querySelector('.js-main');
  if (!main) return;
  const rect = main.getBoundingClientRect();
  if (rect.bottom - window.innerHeight < 300) {
    loadProducts();
  }
});

// Initial load
loadProducts(true);