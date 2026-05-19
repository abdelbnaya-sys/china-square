// ===================================
// CART MANAGEMENT - China Square
// ===================================

// Cart State
let cart = JSON.parse(localStorage.getItem('chinaSquare_cart')) || [];

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.style.display = cart.length > 0 ? 'flex' : 'none';
  }
}

// Add item to cart
function addToCart(productId, productName, price) {
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: price,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }
  
  saveCart();
  updateCartBadge();
  showToast(`${productName} ajouté au panier!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartBadge();
  updateCartDisplay();
  showToast('Produit retiré du panier', 'info');
}

// Update item quantity
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartDisplay();
    }
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('chinaSquare_cart', JSON.stringify(cart));
}

// Get cart total
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
}

// Update cart display (for cart page)
function updateCartDisplay() {
  const cartContainer = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Votre panier est vide</h3>
        <p>Découvrez nos produits à prix imbattables!</p>
        <a href="products.html" class="btn btn-primary">Continuer mes achats</a>
      </div>
    `;
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }
  
  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <div class="cart-item-subtotal">
          <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
  });
  
  cartContainer.innerHTML = html;
  
  if (cartSummary) {
    cartSummary.style.display = 'block';
    document.getElementById('cart-subtotal').textContent = `$${getCartTotal().toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = getCartTotal() >= 39 ? 'GRATUIT' : '$5.99';
    document.getElementById('cart-total').textContent = `$${(getCartTotal() + (getCartTotal() >= 39 ? 0 : 5.99)).toFixed(2)}`;
  }
}

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  updateCartDisplay();
});