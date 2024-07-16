function simuladorCuotas() {
    function obtenerEntrada(id) {
        let valor = document.getElementById(id).value;
        console.log(`obtenerEntrada(${id}): ${valor}`);
        return valor;
    }

    function mostrarMensaje(mensaje) {
        console.log(`mostrarMensaje: ${mensaje}`);
        document.getElementById('resultado').textContent = mensaje;
    }

    function calcularCuota(precio, cuotas) {
        let cuota = precio / cuotas;
        console.log(`calcularCuota(${precio}, ${cuotas}): ${cuota}`);
        return cuota;
    }

    function obtenerDatosUsuario() {
        let nombre = obtenerEntrada("nombre");
        let edad = obtenerEntrada("edad");
        let destino = obtenerEntrada("destino");
        console.log(`obtenerDatosUsuario: { nombre: ${nombre}, edad: ${edad}, destino: ${destino} }`);

        return {
            nombre: nombre,
            edad: edad,
            destino: destino
        };
    }

    let datosUsuario = obtenerDatosUsuario();

    let precioProducto;
    while (true) {
        precioProducto = parseFloat(obtenerEntrada("precioProducto"));

        if (isNaN(precioProducto)) {
            mostrarMensaje("El valor ingresado no es un número. Por favor, ingresá un precio válido.");
        } else if (precioProducto <= 0) {
            mostrarMensaje("El precio debe ser mayor que cero. Por favor, ingresá un precio válido.");
        } else {
            break;
        }
        return;
    }
    console.log(`Precio Producto: ${precioProducto}`);

    let cuotas;
    while (true) {
        cuotas = parseInt(obtenerEntrada("cuotas"));

        if (isNaN(cuotas)) {
            mostrarMensaje("El valor ingresado no es un número. Por favor, ingresá un número de cuotas válido.");
        } else if (cuotas <= 0 || cuotas > 6) {
            mostrarMensaje("El número de cuotas debe estar entre 1 y 6. Por favor, ingresá un número en ese rango.");
        } else {
            break;
        }
        return;
    }
    console.log(`Cuotas: ${cuotas}`);

    let precioPorCuota = calcularCuota(precioProducto, cuotas);

    mostrarMensaje("Estimad@ " + datosUsuario.nombre + ", el precio por cuota para viajar a " + datosUsuario.destino + " es: $" + precioPorCuota.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
}

function reiniciarSimulador() {
    console.log("Reiniciar simulador");
    document.getElementById("simuladorCuotas").reset();
    document.getElementById('resultado').textContent = '';
}