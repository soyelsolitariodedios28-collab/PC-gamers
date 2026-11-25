"use strict";

/*
    PC Gamers
    Sistema de tienda de demostración.

    Credenciales de demostración:
    Usuario: admin
    Contraseña: 12345
*/

const USUARIO_DEMO = "admin";
const CONTRASENA_DEMO = "12345";

const productos = [
    {
        id: 1,
        nombre: "PC Gamer Estandar",
        descripcion: "Computadora para comenzar en el mundo gamer.",
        precio: 4200,
        imagen: "img/pc gamer.jpg"
    },
    {
        id: 2,
        nombre: "PC Gamer Pro",
        descripcion: "Equipo de alto rendimiento para juegos y tareas exigentes.",
        precio: 6800,
        imagen: "img/pc fgamersds.jpg"
    },
    {
        id: 3,
        nombre: "Monitor Gamer 24 pulgadas",
        descripcion: "Monitor para disfrutar tus juegos con una imagen amplia.",
        precio: 1250,
        imagen: "img/monitor 24 pulg.jpg"
    },
    {
        id: 4,
        nombre: "Teclado Gamer",
        descripcion: "Teclado cómodo para jugar y escribir.",
        precio: 220,
        imagen: "img/images (1).jpg"
    },
    {
        id: 5,
        nombre: "Mouse Gamer",
        descripcion: "Mouse diseñado para mejorar el control en tus juegos.",
        precio: 150,
        imagen: "img/mause.jpg"
    },
    {
        id: 6,
        nombre: "Audífonos Gamer",
        descripcion: "Audífonos para jugar, escuchar y comunicarte.",
        precio: 350,
        imagen: "img/audifono Gamer.jpg"
    }
];

let carrito = [];
let usuarioActivo = false;

document.addEventListener("DOMContentLoaded", IniciarSistema);

function IniciarSistema() {
    document.getElementById("formulario-login")
        .addEventListener("submit", Ingresar);

    document.getElementById("boton-cerrar-sesion")
        .addEventListener("click", CerrarSesion);

    document.getElementById("boton-comprar")
        .addEventListener("click", ConfirmarCompra);

    document.getElementById("busqueda")
        .addEventListener("input", BuscarProductos);

    MostrarProductos();
    ActualizarCarrito();
}

function Ingresar(evento) {
    evento.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("mensaje-login");

    if (usuario === "" || contrasena === "") {
        MostrarMensaje(mensaje, "Completa el usuario y la contraseña.", "error");
        return;
    }

    if (usuario === USUARIO_DEMO && contrasena === CONTRASENA_DEMO) {
        usuarioActivo = true;

        document.getElementById("seccion-login").classList.add("oculto");
        document.getElementById("seccion-tienda").classList.remove("oculto");
        document.getElementById("boton-cerrar-sesion").classList.remove("oculto");

        document.getElementById("usuario").value = "";
        document.getElementById("contrasena").value = "";

        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        MostrarMensaje(mensaje, "Usuario o contraseña incorrectos.", "error");
    }
}

function CerrarSesion() {
    usuarioActivo = false;
    carrito = [];

    document.getElementById("seccion-tienda").classList.add("oculto");
    document.getElementById("seccion-login").classList.remove("oculto");
    document.getElementById("boton-cerrar-sesion").classList.add("oculto");

    document.getElementById("mensaje-compra").textContent = "";
    document.getElementById("mensaje-login").textContent = "";

    ActualizarCarrito();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function MostrarProductos(lista = productos) {
    const contenedor = document.getElementById("lista-productos");

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    contenedor.innerHTML = lista.map(function (producto) {
        return `
            <article class="producto">
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>

                <h3>${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <p class="producto-precio">${FormatoPrecio(producto.precio)}</p>
                <button class="boton" type="button"
                    onclick="AgregarAlCarrito(${producto.id})">
                    Agregar al carrito
                </button>
            </article>
        `;
    }).join("");
}

function BuscarProductos() {
    const texto = document.getElementById("busqueda").value.trim().toLowerCase();

    const resultado = productos.filter(function (producto) {
        return producto.nombre.toLowerCase().includes(texto)
            || producto.descripcion.toLowerCase().includes(texto);
    });

    MostrarProductos(resultado);
}

function AgregarAlCarrito(idProducto) {
    if (!usuarioActivo) {
        return;
    }

    const producto = productos.find(function (elemento) {
        return elemento.id === idProducto;
    });

    if (!producto) {
        return;
    }

    const productoEnCarrito = carrito.find(function (elemento) {
        return elemento.id === idProducto;
    });

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    document.getElementById("mensaje-compra").textContent = "";
    ActualizarCarrito();
}

function CambiarCantidad(idProducto, cambio) {
    const producto = carrito.find(function (elemento) {
        return elemento.id === idProducto;
    });

    if (!producto) {
        return;
    }

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        EliminarDelCarrito(idProducto);
    } else {
        ActualizarCarrito();
    }
}

function EliminarDelCarrito(idProducto) {
    carrito = carrito.filter(function (producto) {
        return producto.id !== idProducto;
    });

    ActualizarCarrito();
}

function ActualizarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const contador = document.getElementById("contador-carrito");
    const subtotalElemento = document.getElementById("subtotal");
    const totalElemento = document.getElementById("total");

    let cantidadTotal = 0;
    let subtotal = 0;

    carrito.forEach(function (producto) {
        cantidadTotal += producto.cantidad;
        subtotal += producto.precio * producto.cantidad;
    });

    contador.textContent = cantidadTotal;
    subtotalElemento.textContent = FormatoPrecio(subtotal);
    totalElemento.textContent = FormatoPrecio(subtotal);

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    contenedor.innerHTML = carrito.map(function (producto) {
        return `
            <article class="item-carrito">
                <div>
                    <strong>${producto.nombre}</strong>
                    <p>${FormatoPrecio(producto.precio)} por unidad</p>
                    <p>Subtotal: ${FormatoPrecio(producto.precio * producto.cantidad)}</p>
                </div>

                <div class="controles-carrito">
                    <button class="boton-pequeno" type="button"
                        aria-label="Quitar una unidad"
                        onclick="CambiarCantidad(${producto.id}, -1)">−</button>

                    <span>${producto.cantidad}</span>

                    <button class="boton-pequeno" type="button"
                        aria-label="Agregar una unidad"
                        onclick="CambiarCantidad(${producto.id}, 1)">+</button>

                    <button class="boton-pequeno boton-eliminar" type="button"
                        onclick="EliminarDelCarrito(${producto.id})">
                        Quitar
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

function ConfirmarCompra() {
    const mensaje = document.getElementById("mensaje-compra");

    if (!usuarioActivo) {
        MostrarMensaje(mensaje, "Inicia sesión para realizar una compra.", "error");
        return;
    }

    if (carrito.length === 0) {
        MostrarMensaje(mensaje, "Agrega al menos un producto al carrito.", "error");
        return;
    }

    const totalCompra = carrito.reduce(function (suma, producto) {
        return suma + producto.precio * producto.cantidad;
    }, 0);

    const confirmacion = window.confirm(
        "¿Confirmas la compra por " + FormatoPrecio(totalCompra) + "?"
    );

    if (confirmacion) {
        carrito = [];
        ActualizarCarrito();

        MostrarMensaje(
            mensaje,
            "Compra confirmada.Se realizó el cobro.",
            "exito"
        );
    }
}

function FormatoPrecio(cantidad) {
    return "Bs " + cantidad.toLocaleString("es-BO");
}

function MostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = "mensaje " + tipo;
}

const formularioContacto = document.getElementById("formulario-contacto");
const mensajeEnvioContacto = document.getElementById("mensaje-envio-contacto");

if (formularioContacto && mensajeEnvioContacto) {
    formularioContacto.addEventListener("submit", function (evento) {
        evento.preventDefault();
        mensajeEnvioContacto.textContent = "Mensaje enviado. Nos pondremos en contacto contigo pronto.";
        formularioContacto.reset();
    });
}