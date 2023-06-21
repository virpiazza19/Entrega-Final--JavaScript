let tapetes = []; // Variable global para almacenar los datos de los productos

// Reviso localStorage para saber qué productos se agregaron al carrito
const getTapetesSeleccionados = () => {
  const tapetesSeleccionadosString = localStorage.getItem("tapetesSeleccionados");
  if (tapetesSeleccionadosString) {
    return JSON.parse(tapetesSeleccionadosString);
  } else {
    return [];
  }
};

// Creo las cards de los productos
const verTapete = ({ id, nombre, stock, imagen }) => {
  const contenedorTarjetas = document.querySelector("#contenedorTarjetas");
  const divItem = document.createElement("div");

  divItem.setAttribute("data-aos", "zoom-in");
  divItem.className = "items";
  divItem.innerHTML = `<img class="fotosProductos" src="${imagen}" alt="${nombre}">
                        <h5 class="tituloItem">${nombre}</h5>
                        <form class="formProducto" id="${id}">
                        <span class="stockMensaje">${stock === 0 ? "Sin stock" : `Stock: ${stock}`}</span>
                          <input type="number" class="form-control" name="unidades" placeholder="${stock === 0 ? "Sin Stock" : "unidades"}" min="1" max="${stock}" ${stock === 0 ? "disabled" : ""}>
                          <button type="submit" class="button carritoButton" ${stock === 0 ? "disabled" : ""}>Agregar</button>
                        </form>`;

  contenedorTarjetas.appendChild(divItem);
};

// Muestro las cards de los productos y realizo la carga de unidades al carrito
const mostrarTapetes = async () => {
  const contenedorTarjetas = document.querySelector("#contenedorTarjetas");
  contenedorTarjetas.innerHTML = "";

  try {
    const response = await fetch("../json/tapetes.json");
    const data = await response.json();

    tapetes = data; // Asignar los datos del archivo JSON a la variable tapetes

    data.forEach((tapete) => {
      verTapete(tapete);
    });

    actualizarStockDesdeLocalStorage(); // Actualizar el stock desde el LocalStorage
    const agregarAlCarritoForms = document.querySelectorAll(".formProducto");
    agregarAlCarritoForms.forEach((agregarAlCarritoForm, index) => {
      agregarAlCarritoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const unidadesPorProducto = parseInt(e.target.children["unidades"].value);
        const tapete = tapetes[index]; // Utilizar la variable tapetes en lugar de Alfombras
        agregarAlCarrito(tapete, unidadesPorProducto);
        agregarAlCarritoForm.reset();
      });
    });
  } catch (error) {
    console.error("Error al obtener los datos del archivo JSON", error);
  }
};

// Cuando agrego al carrito, chequeo si ya había agregado antes el producto para sumar las unidades, caso contrario crea el nuevo registro.
const agregarAlCarrito = (tapete, unidadesPorProducto) => {
  const tapetesSeleccionados = getTapetesSeleccionados();
  const indexDelProducto = tapetesSeleccionados.findIndex((item) => item.id === tapete.id);

  if (indexDelProducto !== -1) {
    tapetesSeleccionados[indexDelProducto].cantidad += unidadesPorProducto;
  } else {
    tapetesSeleccionados.push({
      id: tapete.id,
      nombre: tapete.nombre,
      cantidad: unidadesPorProducto,
      imagen: tapete.imagen
    });
  }

  tapete.stock -= unidadesPorProducto;
  localStorage.setItem("tapetesSeleccionados", JSON.stringify(tapetesSeleccionados));

  let cantidadTotal = parseInt(localStorage.getItem("cantidadTotal")) || 0;
  cantidadTotal += unidadesPorProducto;
  localStorage.setItem("cantidadTotal", cantidadTotal.toString());

  actualizarCarrito();
  actualizarStockEnPagina();
};

// Actualizo stock que se muestra en las cards a medida que se carga el producto en el carrito
const actualizarStockEnPagina = () => {
  const tarjetasProductos = document.querySelectorAll(".formProducto");
  tarjetasProductos.forEach((tarjeta) => {
    const idProducto = tarjeta.getAttribute("id");
    const tapete = tapetes.find((prod) => prod.id === idProducto);
    const stockMensaje = tarjeta.querySelector(".stockMensaje");
    const input = tarjeta.querySelector("input");
    const button = tarjeta.querySelector("button");

    stockMensaje.textContent = tapete.stock === 0 ? "Sin stock" : `Stock: ${tapete.stock}`;
    input.disabled = tapete.stock === 0;
    button.disabled = tapete.stock === 0;
  });
};

// Actualizar el número reflejado en el ícono del carrito
const actualizarCarrito = () => {
  const unidadesCarrito = document.querySelector("#unidadesCarrito");
  const cantidadTotal = parseInt(localStorage.getItem("cantidadTotal")) || 0;
  unidadesCarrito.innerText = cantidadTotal;
};

// Reviso el localStorage para calcular el stock real del producto
const actualizarStockDesdeLocalStorage = () => {
  const tapetesSeleccionados = getTapetesSeleccionados();
  tapetesSeleccionados.forEach((item) => {
    const tapete = tapetes.find((prod) => prod.id === item.id);
    if (tapete) {
      tapete.stock -= item.cantidad;

      // Verificar si el stock es cero y deshabilitar el botón y el input
      if (tapete.stock === 0) {
        const tarjetaProducto = document.getElementById(tapete.id);
        if (tarjetaProducto) {
          const input = tarjetaProducto.querySelector("input");
          const button = tarjetaProducto.querySelector("button");
          input.disabled = true;
          button.disabled = true;
        }
      }
    }
  });
  actualizarStockEnPagina();
};

// Chequeo el localStorage cuando se recarga la página para mostrar los datos correctos
window.addEventListener("load", () => {
  const tapetesSeleccionados = getTapetesSeleccionados();
  if (tapetesSeleccionados.length > 0) {
    actualizarStockDesdeLocalStorage();
  }
  mostrarTapetes();
  actualizarCarrito();
});

mostrarTapetes();