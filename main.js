
const products = [
    {
        id: 1,
        name: 'Tomate Orgânico',
        category: 'verduras',
        description: 'Tomates frescos colhidos diretamente da horta',
        price: 8.90,
        emoji: '🍅',
        color: '#ff6b6b'
    },
    {
        id: 2,
        name: 'Banana Prata',
        category: 'frutas',
        description: 'Bananas maduras e doces direto do pomar',
        price: 5.50,
        emoji: '🍌',
        color: '#ffd93d'
    },
    {
        id: 3,
        name: 'Queijo Minas Frescal',
        category: 'laticinios',
        description: 'Queijo artesanal feito com leite fresco da fazenda',
        price: 25.00,
        emoji: '🧀',
        color: '#ffcc02'
    },
    {
        id: 4,
        name: 'Feijão Carioca',
        category: 'graos',
        description: 'Feijão de qualidade superior, selecionado a dedo',
        price: 7.90,
        emoji: '🫘',
        color: '#8b4513'
    },
    {
        id: 5,
        name: 'Maçã Gala',
        category: 'frutas',
        description: 'Maçãs frescas e crocantes, colhidas no ponto certo',
        price: 6.50,
        emoji: '🍎',
        color: '#ff0000'
    },
    {
        id: 6,
        name: 'Alface Crespa',
        category: 'verduras',
        description: 'Alface orgânica fresca, crocante e saborosa',
        price: 3.50,
        emoji: '🥬',
        color: '#4caf50'
    },
    {
        id: 7,
        name: 'Iogurte Natural',
        category: 'laticinios',
        description: 'Iogurte artesanal sem conservantes, puro sabor',
        price: 12.00,
        emoji: '🥛',
        color: '#e3f2fd'
    },
    {
        id: 8,
        name: 'Arroz Integral',
        category: 'graos',
        description: 'Arroz orgânico de alta qualidade, nutritivo e saboroso',
        price: 9.90,
        emoji: '🍚',
        color: '#f5f5dc'
    }
];

// Estado do carrinho
let cart = [];

// Esta função é chamada automaticamente quando a página carrega
window.onload = function() {
    console.log('Página carregada! Inicializando site...');
    
    // Renderizar produtos
    renderProducts();
    
    // Configurar botões de filtro
    setupFilterButtons();
    
    // Configurar botão do carrinho
    setupCartButton();
    
    // Configurar modal
    setupModal();
    
    // Configurar botão de checkout
    setupCheckoutButton();
    
    // Atualizar carrinho
    updateCart();
    
    console.log('Site inicializado com sucesso!');
    console.log('Produtos disponíveis:', products.length);
};

// Função para renderizar produtos
function renderProducts(filter = 'todos') {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error('ERRO: Elemento productsGrid não encontrado!');
        alert('Erro ao carregar produtos. Verifique o console.');
        return;
    }
    
    const filteredProducts = filter === 'todos' 
        ? products 
        : products.filter(product => product.category === filter);
    
    console.log('Renderizando', filteredProducts.length, 'produtos...');
    
    let html = '';
    
    filteredProducts.forEach(product => {
        html += `
            <div class="product-card">
                <div class="product-emoji" style="background: linear-gradient(135deg, ${product.color}20 0%, ${product.color}40 100%);">
                    <span style="font-size: 5rem;">${product.emoji}</span>
                </div>
                <div class="product-info">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        🛒 Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
    });
    
    productsGrid.innerHTML = html;
    
    // IMPORTANTE: Adicionar event listeners aos botões DEPOIS de criar o HTML
    addCartButtonListeners();
    
    console.log('Produtos renderizados com sucesso!');
}

// Função para adicionar listeners aos botões do carrinho
function addCartButtonListeners() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    
    console.log('Adicionando listeners para', buttons.length, 'botões...');
    
    buttons.forEach(button => {
        // Remover listener antigo se existir
        button.removeEventListener('click', handleAddToCart);
        // Adicionar novo listener
        button.addEventListener('click', handleAddToCart);
    });
}

// Função handler para adicionar ao carrinho
function handleAddToCart(event) {
    const button = event.currentTarget;
    const productId = parseInt(button.getAttribute('data-id'));
    
    console.log('Clique detectado! ID do produto:', productId);
    
    if (!productId) {
        console.error('ID do produto inválido!');
        return;
    }
    
    addToCart(productId);
    
    // Feedback visual no botão
    button.style.backgroundColor = '#4CAF50';
    button.textContent = '✅ Adicionado!';
    
    setTimeout(() => {
        button.style.backgroundColor = '#2d5a27';
        button.textContent = '🛒 Adicionar ao Carrinho';
    }, 1000);
}

// Função para adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Produto não encontrado! ID:', productId);
        return;
    }
    
    console.log('Adicionando ao carrinho:', product.name);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Quantidade atualizada:', existingItem.quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
        console.log('Novo item adicionado');
    }
    
    updateCart();
    showNotification(`${product.emoji} ${product.name} adicionado!`);
}

// Função para remover do carrinho
function removeFromCart(productId) {
    console.log('Removendo item:', productId);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Item removido do carrinho');
}

// Funções para ajustar quantidade
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
    } else if (item && item.quantity === 1) {
        removeFromCart(productId);
    }
}

// Função para atualizar o carrinho
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartItems = document.getElementById('cartItems');
    
    if (!cartCount || !cartTotal || !cartItems) {
        console.error('Elementos do carrinho não encontrados!');
        return;
    }
    
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    console.log('Contador atualizado:', totalItems);
    
    // Atualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    console.log('Total atualizado:', total.toFixed(2));
    
    // Renderizar itens do carrinho
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <p style="font-size: 3rem; margin-bottom: 1rem;">🛒</p>
                <p style="font-size: 1.2rem;">Seu carrinho está vazio</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Adicione produtos para começar!</p>
            </div>
        `;
    } else {
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.emoji} ${item.name}</strong>
                        <p>R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remover item">🗑️</button>
                    </div>
                </div>
            `;
        });
        cartItems.innerHTML = html;
    }
    
    console.log('Carrinho atualizado:', cart.length, 'itens');
}

// Função para mostrar notificação
function showNotification(message) {
    // Remover notificações anteriores
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Função para finalizar compra
function checkout() {
    if (cart.length === 0) {
        showNotification('⚠️ Adicione produtos ao carrinho primeiro!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`✅ Compra finalizada com sucesso!\n\nItens: ${itemCount}\nTotal: R$ ${total.toFixed(2)}\n\nObrigado por comprar no AgroMarket! 🌾`);
    
    // Limpar carrinho
    cart = [];
    updateCart();
    closeCartModal();
}

// Funções do modal
function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Modal aberto');
    }
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        console.log('Modal fechado');
    }
}

// Configurar botões
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            console.log('Filtro selecionado:', filter);
            renderProducts(filter);
        });
    });
    
    console.log('Botões de filtro configurados:', filterButtons.length);
}

function setupCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
        console.log('Botão do carrinho configurado');
    }
}

function setupModal() {
    // Fechar modal com botão X
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartModal);
    }
    
    // Fechar modal clicando fora
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCartModal();
            }
        });
    }
    
    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartModal();
        }
    });
    
    console.log('Modal configurado');
}

function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
        console.log('Botão de checkout configurado');
    }
}


function getCategoryName(category) {
    const names = { 
        'frutas': '🍎 Frutas',
        'verduras': '🥬 Verduras',
        'laticinios': '🧀 Laticínios',
        'graos': '🌾 Grãos'
    };
    return names[category] || category;
}

// Mensagem inicial
console.log('🌾 Script do AgroMarket carregado!') ;
console.log('📦 Aguardando carregamento da página...');