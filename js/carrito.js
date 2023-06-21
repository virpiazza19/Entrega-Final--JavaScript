//Productos
const Alfombras = [
    {
        id: "tapete00001",
        nombre: "Alfombra Panaderos",
        stock: 10,
        imagen: "https://drive.google.com/uc?export=view&id=13FyA0CzHqxTTaGXUdhsh5o3RQPZe5_ED"
    },
    {
        id: "tapete00002",
        nombre: "Alfombra K9",
        stock: 9,
        imagen: "https://drive.google.com/uc?export=view&id=1g3spd-pdMXTKf1B6WQ5lw3vveNoP6a_2"
    },
    {
        id: "tapete00003",
        nombre: "Alfombra Slices",
        stock: 15,
        imagen: "https://drive.google.com/uc?export=view&id=1rWN3o_bcQD3fy3_0WO9pP-NEPZldchuX"
    },
    {
        id: "tapete00004",
        nombre: "Alfombra Arcor",
        stock: 12,
        imagen: "https://drive.google.com/uc?export=view&id=1P-JFzcAhVt0CPZSl3aeP5bCIJSDCxyFY"
    },
    {
        id: "tapete00005",
        nombre: "Alfombra Caramelitos",
        stock: 6,
        imagen: "https://drive.google.com/uc?export=view&id=18TIaJkK0bjfqF5zogMcoKpxFSJA5P4jl"
    },
    {
        id: "tapete00006",
        nombre: "Alfombra Bajo El Mar",
        stock: 1,
        imagen: "https://drive.google.com/uc?export=view&id=1XoxonhjIMIOQJhHE8OnqXLTOd2Md6GoL"
    },
    {
        id: "tapete00007",
        nombre: "Alfombra Yumi",
        stock: 30,
        imagen: "https://drive.google.com/uc?export=view&id=1FFZXc9zQEuXSmlEzAXstjA7WedOCvwo3"
    },
    {
        id: "tapete00008",
        nombre: "Alfombra Montagne",
        stock: 7,
        imagen: "https://drive.google.com/uc?export=view&id=1MfSq3kcjwVMckf8vY8RZfe5XbHji-4KG"
    },
    {
        id: "tapete00009",
        nombre: "Alfombra Maxikioso Pablito",
        stock: 18,
        imagen: "https://drive.google.com/uc?export=view&id=1QzncQYptYlswDeh3TpyT-Iam98iVA7i_"
    },
    {
        id: "tapete00010",
        nombre: "Alfombra Harmatiuk",
        stock: 1,
        imagen: "https://drive.google.com/uc?export=view&id=1PvBfuxV_nrzR7nvECLSVYdQrbSZ2-cJ7"
    },
    {
        id: "tapete00011",
        nombre: "Alfombra Harley Davidson",
        stock: 0,
        imagen: "https://drive.google.com/uc?export=view&id=1IDjN4cnC75TI_Yifxxvn1J6dHl9NyJw-"
    },
    {
        id: "tapete00012",
        nombre: "Alfombra Dakros Maxikiosko",
        stock: 10,
        imagen: "https://drive.google.com/uc?export=view&id=1wO8DWpI10QAR5dpMmE_DrPRuleZ3ICSq"
    },
    {
        id: "tapete00012",
        nombre: "Alfombra Bigg",
        stock: 10,
        imagen: "https://drive.google.com/uc?export=view&id=1Qau7AnKmZxxX_zsieUlxJkWCRg-m5S6X"
    }
]

//Reviso localStorage para saber que productos se agregaron al carrito
const getTapetesSeleccionados = () => {
    const tapetesSeleccionadosString = localStorage.getItem("tapetesSeleccionados");
    if (tapetesSeleccionadosString) {
        return JSON.parse(tapetesSeleccionadosString);
    } else {
        return [];
    }
};

//Reviso el localStorage para calcular el stock real del producto
const actualizarStockDesdeLocalStorage = () => {
    const tapetesSeleccionados = getTapetesSeleccionados();
    tapetesSeleccionados.forEach((item) => {
        const tapete = Alfombras.find((prod) => prod.id === item.id);
        if (tapete) {
            tapete.stock -= item.cantidad;
        }
    });
    actualizarStockEnPagina();
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
const mostrarTapetes = () => {
    const contenedorTarjetas = document.querySelector("#contenedorTarjetas");
    contenedorTarjetas.innerHTML = "";

    Alfombras.forEach((tapete) => {
        verTapete(tapete);
    });

    const agregarAlCarritoForms = document.querySelectorAll(".formProducto");
    agregarAlCarritoForms.forEach((agregarAlCarritoForm, index) => {
        agregarAlCarritoForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const unidadesPorProducto = parseInt(e.target.children["unidades"].value);
            const tapete = Alfombras[index];
            agregarAlCarrito(tapete, unidadesPorProducto);
            agregarAlCarritoForm.reset();

        });
    });
};

// Cuando agrego al carrito chequeo si ya había agregado antes el producto para sumar las unidades, caso contrario crea el nuevo registro. 
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
        const tapete = Alfombras.find((prod) => prod.id === idProducto);
        const stockMensaje = tarjeta.querySelector(".stockMensaje");
        stockMensaje.textContent = tapete.stock === 0 ? "Sin stock" : `Stock: ${tapete.stock}`;
    });
};

// Actualizar el número reflejado en el ícono del carrito
const actualizarCarrito = () => {
    const unidadesCarrito = document.querySelector("#unidadesCarrito");
    const cantidadTotal = parseInt(localStorage.getItem("cantidadTotal")) || 0;
    unidadesCarrito.innerText = cantidadTotal;
};

// Chequeo el localStorag cuando se recarga la página para mostrar los datos correctos
window.addEventListener("load", () => {
    const tapetesSeleccionados = getTapetesSeleccionados();
    if (tapetesSeleccionados.length > 0) {
        actualizarStockDesdeLocalStorage();
    }
    mostrarTapetes();
    actualizarCarrito();
    actualizarStockEnPagina();
});

mostrarTapetes();
