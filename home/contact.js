const products = [
    { id: 1, name: 'Bamboo Toothbrush', price: 3.99, description: 'Eco-friendly bamboo toothbrush.', image: 'images78.jpg' },
    { id: 2, name: 'Reusable Shopping Bag', price: 9.99, description: 'Durable and washable reusable shopping bag.', image: 'images23.jpg' },
    { id: 3, name: 'Biodegradable Phone Case', price: 14.99, description: 'Phone case made from biodegradable materials.', image: 'sasa.png' },
    { id: 4, name: 'Natural Shampoo Bar', price: 5.99, description: 'Plastic-free natural shampoo bar.', image: 'asac.png' },
];

function displayProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width:100%;">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Added ${product.name} to cart!`);
}

window.onload = displayProducts;
