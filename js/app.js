
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
                <button class="boton-vista-imagen" type="button" aria-label="Ver imagen ampliada: ${producto.nombre}">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-ropa" loading="lazy">
                </button>
                <span class="etiqueta-producto">${nombresCategorias[producto.categoria]}</span>
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="precio">${formatoPrecio.format(producto.precio)}</p>
                <a class="boton-consultar-instagram" href="https://ig.me/m/ac_tiendaderopa_" target="_blank" rel="noopener noreferrer" aria-label="Consultar por Instagram sobre ${producto.nombre}">
                    Consultar por Instagram
                </a>
            </div>
        </article>
    `).join('');
    document.getElementById('sin-resultados').classList.toggle('oculto', resultados.length > 0);
}

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

const dialogoImagen = document.getElementById('dialogo-imagen');
const imagenAmpliada = document.getElementById('imagen-ampliada');
let posicionScrollImagen = 0;
contenedor.addEventListener('click', evento => {
    const botonImagen = evento.target.closest('.boton-vista-imagen');
    if (!botonImagen) return;
    const imagen = botonImagen.querySelector('img');
    posicionScrollImagen = window.scrollY;
    imagenAmpliada.src = imagen.src;
    imagenAmpliada.alt = imagen.alt;
    dialogoImagen.showModal();
});
document.getElementById('cerrar-imagen').addEventListener('click', () => dialogoImagen.close());
dialogoImagen.addEventListener('click', evento => {
    if (evento.target === dialogoImagen) dialogoImagen.close();
});
dialogoImagen.addEventListener('close', () => {
    const desplazamientoOriginal = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, posicionScrollImagen);
    document.documentElement.style.scrollBehavior = desplazamientoOriginal;
});

document.getElementById('btn-ubicacion').addEventListener('click', evento => {
    const mapa = document.getElementById('mapa-tienda');
    const visible = mapa.classList.toggle('oculto') === false;
    evento.currentTarget.setAttribute('aria-expanded', String(visible));
    evento.currentTarget.innerHTML = visible ? 'Ocultar mapa <span aria-hidden="true">↑</span>' : 'Ver ubicación en el mapa <span aria-hidden="true">→</span>';
});
cargarProductos();
cargarProductos();