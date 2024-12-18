// Datos de productos iniciales
const data = {
	productos: [
	  {
		id: '1',
		nombre: 'Tennis Converse Standard',
		descripcion: 'Consectetur adipisicing elit.',
		precio: 125000.0,
		descuento: 0.5,
		colores: ['negro', 'rojo', 'amarillo'],
		tamaños: ['39', '40', '41', '42', '43', '44'],
		stock: {
		  negro: { 39: 6, 40: 6, 41: 6, 42: 6, 43: 6, 44: 6 },
		  rojo: { 39: 6, 40: 6, 41: 6, 42: 8, 43: 8, 44: 8 },
		  amarillo: { 39: 12, 40: 12, 41: 12, 42: 12, 43: 12, 44: 12 },
		},
	  },
	  {
		id: '2',
		nombre: 'Remera Converse Standard',
		descripcion: 'Consectetur adipisicing elit.',
		precio: 65000.0,
		descuento: 0.5,
		colores: ['blanco', 'verde', 'naranja'],
		tamaños: ['S', 'M', 'L', 'XL'],
		stock: {
		  blanco: { S: 16, M: 6, L: 3, XL: 3 },
		  verde: { S: 16, M: 6, L: 2, XL: 2 },
		  naranja: { S: 16, M: 6, L: 1, XL: 1 },
		},
	  },
	],
  };
  
// Inicializar stock en sessionStorage si no existe
if (!sessionStorage.getItem('stockEstado')) {
sessionStorage.setItem('stockEstado', JSON.stringify(data));
alert("creando sesion storage")
}

// Referencias de elementos del DOM
const colorInputs = document.querySelectorAll('input[name="color"]');
const tamañoInputs = document.querySelectorAll('input[name="tamaño"]');
const stockElement = document.getElementById('stock-actual');

// Producto seleccionado basado en el stock inicial en el DOM
const idref = stockElement.textContent === "6" ? "1" : "2";

// Función para actualizar el stock
function actualizarStock() {
// Obtener el estado actual desde sessionStorage
const stockEstado = JSON.parse(sessionStorage.getItem('stockEstado'));

// Buscar el producto seleccionado
const productoProp = stockEstado.productos.find((p) => p.id === idref);

// Obtener el color y tamaño seleccionados
const colorSeleccionado = document.querySelector('input[name="color"]:checked')?.value;
const tamañoSeleccionado = document.querySelector('input[name="tamaño"]:checked')?.value;

if (colorSeleccionado && tamañoSeleccionado) {
	// Buscar el stock correspondiente
	const stock = productoProp.stock[colorSeleccionado]?.[tamañoSeleccionado] || 0;
	producto_stock=stock
	// Actualizar el span con el stock
	stockElement.textContent = stock;

	// Guardar el estado actualizado en sessionStorage
	sessionStorage.setItem('stockEstado', JSON.stringify(stockEstado));
	
}
}

// Inicializar el stock al cargar la página
actualizarStock();

// Escuchar cambios en los inputs
colorInputs.forEach((input) => input.addEventListener('change', actualizarStock));
tamañoInputs.forEach((input) => input.addEventListener('change', actualizarStock));

//Propiedades del producto
const producto$1 = document.getElementById('producto');
const productoImagen = producto$1.querySelector('.producto__imagen');
const thumbs = producto$1.querySelector('.producto__thumbs');

// Color
const propiedadColor = producto$1.querySelector('#propiedad-color');

// Cantidad
const btnIncrementarCantidad = producto$1.querySelector('#incrementar-cantidad');
const btnDisminuirCantidad = producto$1.querySelector('#disminuir-cantidad');
const inputCantidad = producto$1.querySelector('#cantidad');
// Botones
const botonesAbrirCarrito = document.querySelectorAll('[data-accion="abrir-carrito"]');
const botonesCerrarCarrito = document.querySelectorAll('[data-accion="cerrar-carrito"]');
const btnAgregarAlCarrito = document.getElementById('agregar-al-carrito');
const btnComprar = document.getElementById('carrito__btn-comprar');
// Ventanas Emergentes: carrito y notificacion
const ventanaCarrito = document.getElementById('carrito');
const notificacion = document.getElementById('notificacion');
const formatearMoneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

//recupera el carrito desde el localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const guardarCarrito = () => {
	localStorage.setItem('carrito', JSON.stringify(carrito));
	console.log("guardandoCarrito")
};

const renderCarrito = () => {
    ventanaCarrito.classList.add('carrito--active');
    console.log("renderizandoCarrito");

    // Leer el estado actualizado del sessionStorage
    const stockEstado = JSON.parse(sessionStorage.getItem('stockEstado'));

    // Eliminamos todos los productos anteriores para construir el carrito desde cero.
    const productosAnteriores = ventanaCarrito.querySelectorAll('.carrito__body .carrito__producto');
    if (productosAnteriores) {
        productosAnteriores.forEach((producto) => producto.remove());
        console.log("// Eliminamos todos los productos anteriores para construir el carrito desde cero.");
    }

    let total = 0;
    let subtotal = 0;
    let descuento = 0;
    let iva = 0;

    // Comprobamos si hay productos
    if (carrito.length < 1) {
        // Ponemos la clase de carrito vacío
        ventanaCarrito.classList.add('carrito--vacio');
    } else {
        // Eliminamos la clase de carrito vacío
        ventanaCarrito.classList.remove('carrito--vacio');

        // Iteramos sobre cada producto del carrito
        carrito.forEach((productoCarrito) => {
            // Encontrar el producto en el estado de stock
            const productoEstado = stockEstado.productos.find(p => p.id === productoCarrito.id);
            if (productoEstado) {
                // Obtener el precio correcto del producto desde la lista original
                const productoLista = data.productos.find(p => p.id === productoCarrito.id);
                if (productoLista) {
                    productoCarrito.precio = productoLista.precio;
                }

                // Obtener el stock específico del producto basado en color y tamaño
                const stockActual = productoEstado.stock[productoCarrito.color]?.[productoCarrito.tamaño] || 0;

                // Calcular precios
                subtotal += productoCarrito.precio * productoCarrito.cantidad;
                descuento = 0.05 * subtotal;
                iva = 0.21 * (subtotal - descuento);
                total = subtotal - descuento + iva;

                // Crear el contenido del producto
                let thumbSrc = `../img/thumbs/${productoCarrito.color}.jpg`;

                const plantillaProducto = `
                    <div class="carrito__producto-info">
                        <img src="${thumbSrc}" alt="" class="carrito__thumb" />
                        <div>
                            <p class="carrito__producto-nombre">
                                <span class="carrito__producto-cantidad">${productoCarrito.cantidad} x </span>${productoCarrito.nombre}
                            </p>
                            <p class="carrito__producto-propiedades">
                                Id:<span>${productoCarrito.id}</span>
                                Tamaño:<span>${productoCarrito.tamaño}</span>
                                Color:<span>${productoCarrito.color}</span>
                                Stock:<span>${stockActual}</span>
                            </p>
                        </div>
                    </div>
                    <div class="carrito__producto-contenedor-precio">
                        <button class="carrito__btn-eliminar-item" data-accion="eliminar-item-carrito">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
                            </svg>
                        </button>
                        <p class="carrito__producto-precio">${formatearMoneda.format(productoCarrito.precio * productoCarrito.cantidad)}</p>
                    </div>
                `;

                const itemCarrito = document.createElement('div');
                itemCarrito.classList.add('carrito__producto');
                itemCarrito.innerHTML = plantillaProducto;
                ventanaCarrito.querySelector('.carrito__body').appendChild(itemCarrito);
            }
        });
    }

    // Actualizar totales en el carrito
    ventanaCarrito.querySelector('.carrito__subtotal').innerText = formatearMoneda.format(subtotal);
    ventanaCarrito.querySelector('.carrito__descuento').innerText = formatearMoneda.format(descuento);
    ventanaCarrito.querySelector('.carrito__iva').innerText = formatearMoneda.format(iva);
    ventanaCarrito.querySelector('.carrito__total').innerText = formatearMoneda.format(total);

    guardarCarrito();
};

/*
const renderCarrito = () => {
	ventanaCarrito.classList.add('carrito--active');
	console.log ("renderizandoCarrito")
	// Eliminamos todos los productos anteriores para construir el carrito desde cero.
	const productosAnteriores = ventanaCarrito.querySelectorAll('.carrito__body .carrito__producto');
	if (productosAnteriores) {
		productosAnteriores.forEach((producto) => producto.remove());
		console.log("// Eliminamos todos los productos anteriores para construir el carrito desde cero.")
	}
	let total = 0;
	let subtotal = 0;
	let descuento = 0;
	let iva = 0;
	
	// Comprobamos si hay productos
	if (carrito.length < 1) {
		// Ponemos la clase de carrito vacio
		
		ventanaCarrito.classList.add('carrito--vacio');
			
	} else {
		// Eliminamos la clase de carrito vacio
	
		ventanaCarrito.classList.remove('carrito--vacio');
		
		// Iteramos sobre cada producto del carrito
		carrito.forEach((productoCarrito) => {
			data.productos.forEach((productoLista) => {
				if (productoCarrito.id === productoLista.id) {
					console.log("iteracion en productoscarrito")
					productoCarrito.precio = productoLista.precio;
					subtotal += productoCarrito.precio * productoCarrito.cantidad;
					descuento = 0.05 * subtotal;
					iva = 0.21 * (subtotal - descuento);
					total = subtotal - descuento + iva;
				}
			});

			let thumbSrc = `../img/thumbs/${productoCarrito.color}.jpg`;
			
			console.log (thumbSrc)

			const plantillaProducto = `
				<div class="carrito__producto-info">
					<img src="${thumbSrc}" alt="" class="carrito__thumb" />
					<div>
						<p class="carrito__producto-nombre">
							<span class="carrito__producto-cantidad">${productoCarrito.cantidad} x </span>${productoCarrito.nombre}
						</p>
						<p class="carrito__producto-propiedades">Id:<span>${productoCarrito.id}</span>Tamaño:<span>${productoCarrito.tamaño}</span> Color:<span>${productoCarrito.color}</span>Stock1:<span>${producto_stock}</span></p>
					</div>
				</div>
				<div class="carrito__producto-contenedor-precio">
					<button class="carrito__btn-eliminar-item" data-accion="eliminar-item-carrito">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
						</svg>
					</button>
					<p class="carrito__producto-precio">${formatearMoneda.format(productoCarrito.precio * productoCarrito.cantidad)}</p>
				</div>
			`;

			const itemCarrito = document.createElement('div');
			itemCarrito.classList.add('carrito__producto');
			itemCarrito.innerHTML = plantillaProducto;
			ventanaCarrito.querySelector('.carrito__body').appendChild(itemCarrito);
		});
	}

	ventanaCarrito.querySelector('.carrito__subtotal').innerText = formatearMoneda.format(subtotal);
	ventanaCarrito.querySelector('.carrito__descuento').innerText = formatearMoneda.format(descuento);
	ventanaCarrito.querySelector('.carrito__iva').innerText = formatearMoneda.format(iva);
	ventanaCarrito.querySelector('.carrito__total').innerText = formatearMoneda.format(total);

	guardarCarrito();
};
*/
//// Funcionalidad de las thumbnails
thumbs.addEventListener('click', (e) => {
	if (e.target.tagName === 'IMG') {
		const imagenSrc = e.target.src;
		console.log(imagenSrc)
		// Obtenemos la posicion del ultimo /
		const lastIndex = imagenSrc.lastIndexOf('/');
		// Cortamos la cadena de texto para obtener solamente una parte.
		const nombreImagen = imagenSrc.substring(lastIndex + 1);
		console.log (nombreImagen)
		// Cambiamos la ruta de la imagen del producto.
		productoImagen.src = `../img/tennis/${nombreImagen}`;
	}
});
// Cambiamos la imagen del producto dependiendo de la propiedad que seleccionen
propiedadColor.addEventListener('click', (e) => {
	if (e.target.tagName === 'INPUT') {
		//console.log(e.target.tagName)
		console.log(e.target.value)
		productoImagen.src = `../img/tennis/${e.target.value}.jpg`;
	}
});
// Cambiamos la cantidad a agregar al carrito
btnIncrementarCantidad.addEventListener('click', () => {
	inputCantidad.value = parseInt(inputCantidad.value) + 1;
});

btnDisminuirCantidad.addEventListener('click', () => {
	if (parseInt(inputCantidad.value) > 1) {
		inputCantidad.value = parseInt(inputCantidad.value) - 1;
	}
});

botonesAbrirCarrito.forEach((boton) => {
	boton.addEventListener('click', renderCarrito);
});

botonesCerrarCarrito.forEach((boton) => {
	boton.addEventListener('click', () => {
		ventanaCarrito.classList.remove('carrito--active');
	});
});

btnAgregarAlCarrito.addEventListener('click', () => {
	const id = producto.dataset.productoId;
	const nombre = producto.querySelector('.producto__nombre').innerText;
	const cantidad = parseInt(inputCantidad.value);
	const color = producto.querySelector('#propiedad-color input:checked').value;
	const tamaño = producto.querySelector('#propiedad-tamaño input:checked').value;
		
	// Variable que usamos para saber si el producto ya esta en el carrito o no.
	let productoEnCarrito = false;

	// Validar stock, si el producto no tiene stock retorna
	console.log(producto_stock)
    if (producto_stock <= 0) {
        alert('¡Producto agotado!');
        console.log(producto_stock)
		return;
    }
	
	// si el  producto ya esta en el carrito, asi que solo aumentamos la cantidad.
	carrito.forEach((item) => {
		if (item.id === id && item.nombre === nombre && item.color === color && item.tamaño === tamaño) {
			// El producto ya esta en el carrito, aumentamos la cantidad.
			item.cantidad += cantidad;
			productoEnCarrito = true;
		}
	});
	// Si El producto No esta en el carrito, lo añadimos.
	if (!productoEnCarrito) {
		carrito.push({ id, nombre, cantidad, color, tamaño });
	}

	// Reducir stock
    producto_stock--;

	//actualiza el stock en pantalla
    document.getElementById(`stock-actual`).textContent = producto_stock;
    //console.log(producto_stock)

	notificacion.querySelector('img').src = `../img/thumbs/${color}.jpg`;
	notificacion.classList.add('notificacion--active');
	setTimeout(() => notificacion.classList.remove('notificacion--active'), 5000);
	guardarCarrito();

	// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
	// 1. Obtener stock desde sessionStorage
	let stockEstado = JSON.parse(sessionStorage.getItem("stockEstado")) || JSON.parse(JSON.stringify(data));
	console.log(stockEstado)
	// 2. Encontrar el producto por ID
	let productols = stockEstado.productos.find((p) => p.id === id);
	console.log(productols)
	if (productols && productols.stock[color] && productols.stock[color][tamaño] > 0) {
		// 3. Reducir el stock
		productols.stock[color][tamaño] -= 1;
		producto_stock=productols.stock[color][tamaño]
		// Actualizar stock en la pantalla
		//document.getElementById("stock-actual").innerText = producto.stock[color][tamaño];
		document.getElementById(`stock-actual`).textContent = productols.stock[color][tamaño];

		// 4. Guardar el stock actualizado en sessionStorage
		sessionStorage.setItem("stockEstado", JSON.stringify(stockEstado));
  
	} 
  }

);

// Eliminar producto del carrito
ventanaCarrito.addEventListener('click', (e) => {
    if (e.target.closest('button')?.dataset.accion === 'eliminar-item-carrito') {
        const productoElemento = e.target.closest('.carrito__producto');
        const indexProducto = [...ventanaCarrito.querySelectorAll('.carrito__producto')].indexOf(productoElemento);
        const productoEnCarrito = carrito[indexProducto]; // Obtener el producto a eliminar

        // Restablecer el stock en sessionStorage
        const stockEstado = JSON.parse(sessionStorage.getItem('stockEstado'));
        const productoEstado = stockEstado.productos.find(producto => producto.id === productoEnCarrito.id);

        if (productoEstado) {
            const stockColor = productoEstado.stock[productoEnCarrito.color];
            if (stockColor && stockColor[productoEnCarrito.tamaño] !== undefined) {
                // Incrementar el stock del producto eliminado
                stockColor[productoEnCarrito.tamaño] += productoEnCarrito.cantidad;
            }
        }

        // Guardar el nuevo estado del stock en sessionStorage
        sessionStorage.setItem('stockEstado', JSON.stringify(stockEstado));

        // Eliminar el producto del carrito
        carrito = carrito.filter((_, index) => index !== indexProducto);

        // Renderizar nuevamente el carrito
        renderCarrito();
		actualizarStock();
    }
});


/*// Eliminar producto del carrito
ventanaCarrito.addEventListener('click', (e) => {
    if (e.target.closest('button')?.dataset.accion === 'eliminar-item-carrito') {
        const producto = e.target.closest('.carrito__producto');
        const indexProducto = [...ventanaCarrito.querySelectorAll('.carrito__producto')].indexOf(producto);
        carrito = carrito.filter((_, index) => index !== indexProducto);
		// Obtener el producto a eliminar
        const productoEnCarrito = carrito[indexProducto];
        
        // Renderizar nuevamente el carrito
        renderCarrito();
    }
});
*/

btnComprar.addEventListener('click', () => {
	alert('Enviado petición de compra:', carrito);
	carrito = [];
	renderCarrito();

});
