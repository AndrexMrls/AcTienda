
const productos = [
    { id: 1, nombre: "Vestido amarillo formal", precio: 70000, imagen: "./assets/vestido.jpeg", categoria: "vestidos" },
    { id: 2, nombre: "Set dos piezas rosa", precio: 90000, imagen: "./assets/Blusa.jpeg", categoria: "set-dos-piezas" },
    { id: 3, nombre: "Set dos piezas pantalón y blusa negra", precio: 110000, imagen: "./assets/pantalon.jpeg", categoria: "set-dos-piezas" },
    { id: 4, nombre: "Vestido blanco", precio: 80000, imagen: "./assets/vestidoBlanco.jpeg", categoria: "vestidos" }
];
const nombresCategorias = {
    vestidos: 'Vestido',
    'set-dos-piezas': 'Set dos piezas',
    jeans: 'Jeans',
    short: 'Short',
    blusas: 'Blusas'
};

const formatoPrecio = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});
const contenedor = document.getElementById('contenedor-productos');
const carrito = JSON.parse(localStorage.getItem('ac-tienda-carrito') || '[]');
let categoriaActiva = 'todos';

function cargarProductos() {
    const busqueda = document.getElementById('buscar-productos').value.trim().toLocaleLowerCase('es');
    const resultados = productos.filter(producto => {
        const coincideCategoria = categoriaActiva === 'todos' || producto.categoria === categoriaActiva;
        return coincideCategoria && producto.nombre.toLocaleLowerCase('es').includes(busqueda);
    });

    contenedor.innerHTML = resultados.map(producto => `
        <article class="tarjeta-producto">
            <div class="producto-foto">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-ropa" loading="lazy">
                <span class="etiqueta-producto">${nombresCategorias[producto.categoria]}</span>
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="precio">${formatoPrecio.format(producto.precio)}</p>
                <div class="producto-acciones">
                    <label class="oculto" for="talla-${producto.id}">Talla para ${producto.nombre}</label>
                    <select class="selector-talla" id="talla-${producto.id}" aria-label="Elige talla para ${producto.nombre}">
                        <option value="S">Talla S</option><option value="M">Talla M</option><option value="L">Talla L</option>
                    </select>
                    <button class="btn-carrito" type="button" data-agregar="${producto.id}">Añadir al carrito</button>
                </div>
            </div>
        </article>
    `).join('');
    document.getElementById('sin-resultados').classList.toggle('oculto', resultados.length > 0);
}

function guardarCarrito() {
    localStorage.setItem('ac-tienda-carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
    const total = carrito.reduce((suma, item) => {
        const producto = productos.find(prenda => prenda.id === item.id);
        return suma + (producto ? producto.precio * item.cantidad : 0);
    }, 0);

    document.getElementById('contador-carrito').textContent = cantidad;
    document.getElementById('abrir-carrito').setAttribute('aria-label', `Abrir carrito, ${cantidad} productos`);
    document.getElementById('total-carrito').textContent = formatoPrecio.format(total);
    document.getElementById('carrito-vacio').classList.toggle('oculto', carrito.length > 0);
    document.getElementById('items-carrito').innerHTML = carrito.map((item, indice) => {
        const producto = productos.find(prenda => prenda.id === item.id);
        if (!producto) return '';
        return `<article class="item-carrito"><div><strong>${producto.nombre}</strong><p>Talla ${item.talla} · ${item.cantidad} × ${formatoPrecio.format(producto.precio)}</p></div><button class="quitar-item" type="button" data-quitar="${indice}">Quitar</button></article>`;
    }).join('');
}

contenedor.addEventListener('click', evento => {
    const boton = evento.target.closest('[data-agregar]');
    if (!boton) return;
    const id = Number(boton.dataset.agregar);
    const talla = document.getElementById(`talla-${id}`).value;
    const existente = carrito.find(item => item.id === id && item.talla === talla);
    if (existente) existente.cantidad += 1;
    else carrito.push({ id, talla, cantidad: 1 });
    guardarCarrito();
    boton.textContent = 'Añadido';
    window.setTimeout(() => { boton.textContent = 'Añadir al carrito'; }, 1100);
});

document.getElementById('buscar-productos').addEventListener('input', cargarProductos);
document.querySelectorAll('.filtro').forEach(boton => {
    boton.addEventListener('click', () => {
        categoriaActiva = boton.dataset.categoria;
        document.querySelectorAll('.filtro').forEach(filtro => {
            const activo = filtro === boton;
            filtro.classList.toggle('activo', activo);
            filtro.setAttribute('aria-pressed', String(activo));
        });
        cargarProductos();
    });
});

const dialogoCarrito = document.getElementById('dialogo-carrito');
document.getElementById('abrir-carrito').addEventListener('click', () => dialogoCarrito.showModal());
document.getElementById('cerrar-carrito').addEventListener('click', () => dialogoCarrito.close());
document.getElementById('items-carrito').addEventListener('click', evento => {
    const boton = evento.target.closest('[data-quitar]');
    if (!boton) return;
    carrito.splice(Number(boton.dataset.quitar), 1);
    guardarCarrito();
});
document.getElementById('finalizar-compra').addEventListener('click', () => dialogoCarrito.close());

document.getElementById('btn-ubicacion').addEventListener('click', evento => {
    const mapa = document.getElementById('mapa-tienda');
    const visible = mapa.classList.toggle('oculto') === false;
    evento.currentTarget.setAttribute('aria-expanded', String(visible));
    evento.currentTarget.innerHTML = visible ? 'Ocultar mapa <span aria-hidden="true">↑</span>' : 'Ver ubicación en el mapa <span aria-hidden="true">→</span>';
});

cargarProductos();
actualizarCarrito();