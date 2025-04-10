async function fetchProducts() {
    try {
        // Show loading state
        document.getElementById('loading').classList.remove('hidden');
        
        // Fetch products using the global service
        const products = await window.productService.getAllProducts();

        // Clear existing products
        const container = document.getElementById('productsContainer');
        container.innerHTML = '';

        // Render products
        products.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        // You could show an error message to the user here
    } finally {
        // Hide loading state
        document.getElementById('loading').classList.add('hidden');
    }
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'min-w-[200px] product-card snap-start';
    
    div.innerHTML = `
        <div class="bg-white rounded-lg p-2 mb-3">
            <img src="${product.image_url}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg">
        </div>
        <h3 class="font-semibold mx-8">${product.name}</h3>
        <p class="text-gray-600 mx-8">${product.price} DA</p>
        <div class="flex gap-2 mt-2 mx-8">
            <a href="product-details.html?id=${product.id}" class="font-semibold bg-black text-white px-2 py-1 rounded-full hover:bg-gray-800 transition-colors">
                Détails
            </a>
        </div>
    `;

    return div;
}

// Initialize products when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts); 