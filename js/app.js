
const productos = [
    { id: 1, nombre: "Vestido Amarillo Formal ", precio: 70.000, imagen: "./assets/vestido.jpeg" },
    { id: 2, nombre: "Conjunto Rosa", precio: 90.000, imagen: "./assets/Blusa.jpeg" },
    { id: 3, nombre: "Conjunto Pantalon Y Blusa Negra", precio: 110.000, imagen: "./assets/pantalon.jpeg" },
    { id: 4, nombre: "Vestido Blanco", precio: 80.00, imagen: "./assets/vestidoBlanco.jpeg" }
];

const contenedor = document.getElementById('contenedor-productos');

// Renderizar las tarjetas
function cargarProductos() {
    contenedor.innerHTML = ''; 
    
    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');
        
        tarjeta.innerHTML = `
            <!-- Aquí reemplazamos el placeholder por la imagen real -->
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-ropa">
            
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <button class="btn-carrito" onclick="agregarAlCarrito('${producto.nombre}')">Añadir al carrito</button>
        `;
        
        contenedor.appendChild(tarjeta);
    });
}

// Función del botón del carrito
function agregarAlCarrito(nombreProducto) {
    alert(`¡Agregaste "${nombreProducto}" a tu carrito de compras!`);
}

// Función para mostrar/ocultar el mapa de Google
function toggleMapa() {
    const mapa = document.getElementById('mapa-tienda');
    const boton = document.getElementById('btn-ubicacion');

    if (mapa.classList.contains('oculto')) {
        mapa.classList.remove('oculto');
        boton.textContent = 'Ocultar Mapa';
    } else {
        mapa.classList.add('oculto');
        boton.textContent = 'Ver Ubicación en el Mapa';
    }
}

document.addEventListener('DOMContentLoaded', cargarProductos);