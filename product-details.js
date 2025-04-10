async function loadProductDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            console.error('No product ID provided');
            return;
        }

        // Fetch product details
        const product = await window.productService.getProductById(productId);

        // Update main content
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = `${product.price} DA`;
        document.getElementById('originalPrice').textContent = `${Math.round(product.price * 1.25)} DA`;
        document.getElementById('productDescription').textContent = product.description;

        // Get all product images (main image + additional images)
        const allImages = [product.image_url, ...(product.additional_images || [])];

        // Set main image
        const mainImage = document.getElementById('mainImage');
        mainImage.src = allImages[0];
        mainImage.alt = product.name;

        // Create thumbnail gallery
        createThumbnailGallery(allImages);

        // Add rating stars
        const starsContainer = document.querySelector('.flex.text-yellow-400');
        starsContainer.innerHTML = createStarRating(product.rating || 5);

    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

function createThumbnailGallery(images) {
    const thumbnailNav = document.querySelector('.thumbnail-nav').parentElement;
    thumbnailNav.innerHTML = ''; // Clear existing thumbnails

    images.forEach((imgUrl, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail-nav relative ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `
            <img src="${imgUrl}" alt="" class="w-full h-20 object-cover rounded-2xl cursor-pointer">
            <span class="absolute top-2 left-2 bg-white text-xs px-2 py-1 rounded-full">${index + 1}</span>
        `;

        thumbnail.addEventListener('click', () => {
            // Update main image with fade effect
            const mainImage = document.getElementById('mainImage');
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = imgUrl;
                mainImage.style.opacity = '1';
            }, 200);

            // Update active state
            document.querySelectorAll('.thumbnail-nav').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });

        thumbnailNav.appendChild(thumbnail);
    });
}

function createStarRating(rating) {
    return Array(5).fill().map((_, i) => `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
    `).join('');
}

// Load product details when page loads
document.addEventListener('DOMContentLoaded', loadProductDetails); 