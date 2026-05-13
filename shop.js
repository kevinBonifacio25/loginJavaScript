const API_URL = "http://localhost:3000/";

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Cargar productos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarCarrito();
});

// Función para cargar productos desde la API
function cargarProductos() {
    fetch(API_URL + "productos")
        .then(response => response.json())
        .then(productos => {
            const contenedor = document.getElementById("products-container");
            contenedor.innerHTML = "";
            
            productos.forEach(producto => {
                const productoDiv = document.createElement("div");
                productoDiv.className = "product-card";
                productoDiv.innerHTML = `
                    <div class="product-name">${producto.nombre}</div>
                    <div class="product-category">${producto.categoria}</div>
                    <div class="product-price">$${producto.precio.toLocaleString('es-CO')}</div>
                    <button class="add-to-cart-btn" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                `;
                contenedor.appendChild(productoDiv);
            });
        })
        .catch(error => console.error("Error cargando productos:", error));
}

// Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(p => p.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion("Producto agregado al carrito");
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    actualizarCarrito();
}

// Función para actualizar la cantidad de un producto
function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        const producto = carrito.find(p => p.id === id);
        if (producto) {
            producto.cantidad = nuevaCantidad;
            guardarCarrito();
            actualizarCarrito();
        }
    }
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const cartItemsDiv = document.getElementById("cart-items");
    const totalPriceSpan = document.getElementById("total-price");
    
    if (carrito.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart">El carrito está vacío</div>';
        totalPriceSpan.textContent = "$0";
        return;
    }
    
    let html = "";
    let total = 0;
    
    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        
        html += `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #444;">
                <div class="cart-item">
                    <span>${producto.nombre}</span>
                    <span>$${producto.precio.toLocaleString('es-CO')}</span>
                </div>
                <div style="display: flex; align-items: center; margin-top: 8px; gap: 10px;">
                    <button onclick="actualizarCantidad(${producto.id}, ${producto.cantidad - 1})" style="width: 30px; background-color: #FFC312; color: black; border: none; border-radius: 3px; cursor: pointer;">-</button>
                    <input type="number" value="${producto.cantidad}" onchange="actualizarCantidad(${producto.id}, this.value)" style="width: 50px; text-align: center; background-color: rgba(255,255,255,0.1); color: white; border: 1px solid #FFC312; border-radius: 3px; padding: 5px;">
                    <button onclick="actualizarCantidad(${producto.id}, ${producto.cantidad + 1})" style="width: 30px; background-color: #FFC312; color: black; border: none; border-radius: 3px; cursor: pointer;">+</button>
                    <button onclick="eliminarDelCarrito(${producto.id})" style="margin-left: auto; background-color: #ff4444; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div style="margin-top: 8px; text-align: right; color: #FFC312;">
                    Subtotal: $${subtotal.toLocaleString('es-CO')}
                </div>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    totalPriceSpan.textContent = "$" + total.toLocaleString('es-CO');
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para procesar la compra
document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío. Agrega productos antes de comprar.");
                return;
            }
            
            const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
            alert(`¡Compra realizada! Total: $${total.toLocaleString('es-CO')}\n\nGracias por tu compra.`);
            
            // Limpiar carrito después de comprar
            carrito = [];
            guardarCarrito();
            actualizarCarrito();
        });
    }
    
    const clearCartBtn = document.getElementById("clearCartBtn");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que deseas limpiar el carrito?")) {
                carrito = [];
                guardarCarrito();
                actualizarCarrito();
            }
        });
    }
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    // Crear un pequeño toast visual
    const toast = document.createElement("div");
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #FFC312;
        color: black;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Agregar animación
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
