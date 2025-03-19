// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Add to cart functionality
function addToCart(productId, title, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: title,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // Show notification
    showNotification('Item added to cart!');
}

// Remove from cart functionality
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Item removed from cart!');
}

// Update quantity in cart
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        return total + (price * item.quantity);
    }, 0);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('#cart-items');
    const cartTotalElement = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) return; // Not on cart page
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartSummary(0);
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f'}" alt="${item.title}" 
                 onerror="this.src='https://images.unsplash.com/photo-1572635196237-14b3f281503f'">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = calculateTotal();
    updateCartSummary(cart);
}

// Update cart summary
function updateCartSummary(cart) {
    const subtotal = calculateTotal();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = `KSH ${subtotal.toLocaleString()}`;
    document.getElementById('cart-tax').textContent = `KSH ${tax.toLocaleString()}`;
    document.getElementById('cart-total').textContent = `KSH ${total.toLocaleString()}`;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Initialize cart count and display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            const title = productCard.querySelector('.product-title').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            const image = productCard.querySelector('.product-image img').src;
            
            addToCart(productId, title, price, image);
        });
    });
});

// Handle checkout form submission
function handleCheckout(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    const orderData = {
        customerInfo: Object.fromEntries(formData),
        items: cart,
        total: calculateTotal()
    };
    
    // Store order data
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show dialog box
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>Thank you for purchasing from us!</h2>
            <p>Your order has been successfully placed.</p>
            <button class="dialog-btn" onclick="this.closest('.dialog-overlay').remove(); window.location.href='index.html'">Go Back Home</button>
        </div>
    `;
    document.body.appendChild(dialog);
}

// Initialize checkout form
function initializeCheckoutForm() {
    const form = document.querySelector('.checkout-form');
    if (form) {
        form.addEventListener('submit', handleCheckout);
        // Also add click event listener to the place order button
        const placeOrderBtn = form.querySelector('button[type="submit"]');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', handleCheckout);
        }
    }
}

// Initialize category cards
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h3').textContent;
            window.location.href = `products.html?category=${encodeURIComponent(category)}`;
        });
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    initializeCheckoutForm();
    initializeCategoryCards();
}); 
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});