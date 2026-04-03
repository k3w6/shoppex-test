// TaxHub Shoppex Integration
const STORE_SLUG = 'taxhub'; 

// Initialize Shoppex SDK
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Shoppex
    if (window.shoppex) {
        window.shoppex.init({
            storeSlug: STORE_SLUG
        });
        
        // Fetch real-time products
        fetchProducts();
    } else {
        console.error("Shoppex SDK not loaded.");
    }

    // 2. Clipboard Logic
    const copyBtn = document.getElementById('copy-btn');
    const loaderCode = document.getElementById('loader-code');

    if (copyBtn && loaderCode) {
        copyBtn.addEventListener('click', () => {
            const text = loaderCode.innerText;
            navigator.clipboard.writeText(text).then(() => {
                // Success styling
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px; color: #27c93f;"></i> <span style="color: #27c93f">Copied!</span>`;
                lucide.createIcons(); // Refresh icons for the new HTML
                
                copyBtn.classList.add('active');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.classList.remove('active');
                    lucide.createIcons();
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // 3. Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

async function fetchProducts() {
    try {
        const products = await window.shoppex.getProducts();
        console.log("Fetched Products:", products);

        products.forEach(product => {
            updateProductUI(product);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback for UI if fetch fails
        document.querySelectorAll('.amount').forEach(el => el.innerText = "Error");
    }
}

function updateProductUI(product) {
    // We search for elements by ID matching the product ID
    const priceEl = document.getElementById(`price-${product.id}`);
    const stockEl = document.getElementById(`stock-${product.id}`);
    const indicatorEl = document.querySelector(`#card-${product.id} .stock-indicator`);

    if (priceEl) {
        priceEl.innerText = product.price;
    }
    
    if (stockEl) {
        stockEl.innerText = `Stock: ${product.stock > 0 ? product.stock : 'Out of Stock'}`;
        
        // Visual feedback for stock levels
        if (product.stock === 0) {
            stockEl.style.color = '#ff5f56';
            if (indicatorEl) {
                indicatorEl.style.background = '#ff5f56';
                indicatorEl.style.boxShadow = '0 0 8px #ff5f56';
            }
        } else if (product.stock < 10) {
            stockEl.style.color = '#ffbd2e';
            if (indicatorEl) {
                indicatorEl.style.background = '#ffbd2e';
                indicatorEl.style.boxShadow = '0 0 8px #ffbd2e';
            }
        } else {
            stockEl.style.color = 'var(--accent-cyan)';
            if (indicatorEl) {
                indicatorEl.style.background = 'var(--accent-cyan)';
                indicatorEl.style.boxShadow = '0 0 8px var(--accent-cyan)';
            }
        }
    }
}

function buyProduct(productId) {
    if (window.shoppex) {
        window.shoppex.checkout(productId);
    } else {
        alert("Payment system is currently unavailable.");
    }
}
