// Handle mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.product-card button');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('p').textContent;
            
            // Here you would typically open a modal with product details
            console.log(`Quick view: ${productName} - ${productPrice}`);
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.product-card button:last-child');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Animation for adding to cart
            button.innerHTML = 'Added to Cart ✓';
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.innerHTML = 'Add to Cart';
                button.classList.remove('bg-green-600');
            }, 2000);
            
            // Here you would typically update the cart state
            console.log(`Added to cart: ${productName}`);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Here you would typically implement search functionality
        console.log(`Searching for: ${searchTerm}`);
    });

    // Add click handler for Commander button
    const commanderButton = document.querySelector('#cartSidebar .mt-6 button');
    commanderButton.addEventListener('click', () => {
        toggleCart(); // Close the cart sidebar
        toggleCheckout(); // Open the checkout modal
    });

    // Close button handler - only closes the modal
    document.querySelector('#checkoutModal button[onclick="toggleCheckout()"]').addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('checkoutModal');
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Overlay click handler - only closes the modal
    document.getElementById('checkoutModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget || e.target.classList.contains('backdrop-blur-sm')) {
            const modal = document.getElementById('checkoutModal');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // ESC key handler - only closes the modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('checkoutModal');
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }
    });
});

let cart = [];
let total = 0;

function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    if (cart.length > 0) {
        counter.textContent = cart.length;
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.classList.contains('translate-x-full')) {
        // Open cart
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        // Close cart
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
}

function addToCart(name, price, image) {
    cart.push({ name, price, image });
    total += price;
    updateCart();
    updateCartCounter();
    toggleCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-lg p-3">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
            <div class="flex-1">
                <h3 class="font-medium text-gray-800">${item.name}</h3>
                <p class="text-primary font-semibold">${item.price} DA</p>
            </div>
            <button onclick="removeFromCart(${cart.indexOf(item)})" class="text-gray-400 hover:text-red-500 transition-colors">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    cartTotal.textContent = `${total} DA`;
}

function removeFromCart(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCart();
    updateCartCounter();
}

// Initialize cart functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to all "Ajouter au panier" buttons
    document.querySelectorAll('.product-card button').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('p').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const image = card.querySelector('img').src;
            
            addToCart(name, price, image);
        });
    });

    // Close cart when clicking overlay
    document.getElementById('overlay').addEventListener('click', toggleCart);

    // Close cart with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('cartSidebar');
            if (!sidebar.classList.contains('translate-x-full')) {
                toggleCart();
            }
        }
    });
});

function toggleCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        updateCheckoutSummary();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-2">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                <span class="font-medium">${item.name}</span>
            </div>
            <span class="text-primary font-semibold">${item.price} DA</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = `${total} DA`;
}

// Add form submission handler
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Here you would typically send the order data to your server
    const formData = new FormData(e.target);
    const orderData = {
        customerInfo: Object.fromEntries(formData),
        items: cart,
        total: total
    };
    
    console.log('Order submitted:', orderData);
    
    // Clear cart and close checkout
    cart = [];
    total = 0;
    updateCart();
    updateCartCounter();
    toggleCheckout();
    
    // Show success message (you can customize this)
    alert('Votre commande a été envoyée avec succès!');
}); 