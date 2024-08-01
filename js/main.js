//Array para almacenar historial de simulación de cuotas
let historialSimulaciones = [];
// Función para calcular y mostrar cuotas
function simuladorCuotas() {
    function obtenerEntrada(id) {
        return document.getElementById(id).value;
    }

    function mostrarMensaje(mensaje) {
        document.getElementById('resultado').textContent = mensaje;
        console.log(mensaje);
    }

    function calcularCuotaConInteres(precio, cuotas, interesAnual) {
        let interesMensual = interesAnual / 12 / 100;
        let cuota = precio * interesMensual / (1 - Math.pow(1 + interesMensual, -cuotas));
        console.log(`Interés mensual: ${interesMensual}, Cuota: ${cuota}`);
        return Math.round(cuota);
    }

    function calcularCuota(precio, cuotas) {
        let cuota;
        if (cuotas === 9) {
            cuota = calcularCuotaConInteres(precio, cuotas, 24.85);
        } else if (cuotas === 12) {
            cuota = calcularCuotaConInteres(precio, cuotas, 34.22);
        } else {
            cuota = Math.round(precio / cuotas);
        }
        console.log(`Cuota calculada: ${cuota}`);
        return cuota;
    }
    // Formulario de datos del usuario
    function obtenerDatosUsuario() {
        let nombre = obtenerEntrada("nombre");
        let edad = obtenerEntrada("edad");
        let destino = obtenerEntrada("destino");

        console.log(`Datos del usuario - Nombre: ${nombre}, Edad: ${edad}, Destino: ${destino}`);
        return {
            nombre: nombre,
            edad: edad,
            destino: destino
        };
    }

    function limpiarYConvertirPrecio(precio) {
        let precioConvertido = parseFloat(precio.replace(/[^0-9,.-]/g, '').replace(',', '.'));
        console.log(`Precio convertido: ${precioConvertido}`);
        return precioConvertido;
    }
    // Añadir simulación al historial
    let datosUsuario = obtenerDatosUsuario();
    let precioProducto = limpiarYConvertirPrecio(obtenerEntrada("precioProducto"));
    let cuotas = parseInt(obtenerEntrada("cuotas"));
    let precioPorCuota = calcularCuota(precioProducto, cuotas);

    let mensaje = `Estimad@ ${datosUsuario.nombre}, el precio por cuota para viajar a ${datosUsuario.destino} es: $${precioPorCuota.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    mostrarMensaje(mensaje);

    let simulacion = { ...datosUsuario, precioProducto, cuotas, precioPorCuota };
    historialSimulaciones.push(simulacion);
    console.log(`Simulación añadida al historial: ${JSON.stringify(simulacion)}`);
    mostrarHistorial();
}
// Historial de simulaciones almacenadas
function mostrarHistorial() {
    let listaHistorial = document.getElementById('listaHistorial');
    listaHistorial.innerHTML = '';

    historialSimulaciones.forEach((simulacion, index) => {
        let item = document.createElement('li');
        item.textContent = `Simulación ${index + 1}: ${simulacion.nombre}, ${simulacion.destino}, $${simulacion.precioPorCuota} por cuota (${simulacion.cuotas} cuotas)`;
        listaHistorial.appendChild(item);
        console.log(`Historial actualizado: ${item.textContent}`);
    });
}
// Guardar formulario en txt
function guardarHistorial() {
    if (confirm("¿Está seguro que desea guardar el historial de tu viaje?")) {
        let contenido = historialSimulaciones.map((simulacion, index) => {
            return `Simulación ${index + 1}: ${simulacion.nombre}, ${simulacion.destino}, $${simulacion.precioPorCuota} por cuota (${simulacion.cuotas} cuotas)`;
        }).join('\n');

        let blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
        let enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = "historial_simulaciones.txt";
        enlace.click();
        console.log('Historial guardado');
    }
}
// Reinicia formulario
function reiniciarSimulador() {
    document.getElementById("simuladorCuotas").reset();
    document.getElementById('resultado').textContent = '';
    document.getElementById('listaHistorial').innerHTML = '';
    console.log('Simulador reiniciado');
}
