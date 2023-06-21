class Mensajes {
    constructor(nombre, apellido, mail, telefono, mensaje) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.telefono = telefono;
        this.mensaje = mensaje;
    }
}

//Traigo los registros del formulario existentes dentro del localStorage
const listaMensajes = () => {
    const mensajesString = localStorage.getItem("listaMensajes");
    if (mensajesString) {
        return JSON.parse(mensajesString);
    } else {
        return [];
    }
};

// Ejecuto la función de agregarMensaje cuando aprieto el botón de submit
const formulario = document.querySelector("#formMensajes");
formulario.addEventListener("submit", agregarMensaje);

// Función para agregar mensajes al localStorage
function agregarMensaje(event) {
    event.preventDefault();

    const nombre = event.target.nombre.value;
    const apellido = event.target.apellido.value;
    const mail = event.target.mail.value;
    const telefono = event.target.telefono.value;
    const mensaje = event.target.mensaje.value;

    const nuevoMensaje = new Mensajes(nombre, apellido, mail, telefono, mensaje);
    const mensajes = listaMensajes();
    mensajes.push(nuevoMensaje); 

    localStorage.setItem("listaMensajes", JSON.stringify(mensajes));
    formulario.reset();
}
