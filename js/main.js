// Array para almacenar el historial de simulaciones
let historialSimulaciones = [];

// Función principal del simulador de cuotas
function simuladorCuotas() {
    function obtenerEntrada(id) {
        return document.getElementById(id).value;
    }

    function mostrarMensaje(mensaje) {
        document.getElementById('resultado').textContent = mensaje;
    }

    function calcularCuotaConInteres(precio, cuotas, interesAnual) {
        let interesMensual = interesAnual / 12 / 100;
        let cuota = precio * interesMensual / (1 - Math.pow(1 + interesMensual, -cuotas));
        console.log(`Cuota calculada con interés: $${cuota.toFixed(2)} (interés anual: ${interesAnual}%)`);
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
        console.log(`Cuota calculada: $${cuota}`);
        return cuota;
    }

    function obtenerDatosUsuario() {
        let nombre = obtenerEntrada("nombre");
        let edad = obtenerEntrada("edad");
        let destino = obtenerEntrada("destino");

        console.log(`Datos de usuario obtenidos: Nombre - ${nombre}, Edad - ${edad}, Destino - ${destino}`);
        return {
            nombre: nombre,
            edad: edad,
            destino: destino
        };
    }

    function limpiarYConvertirPrecio(precio) {
        let precioConvertido = parseFloat(precio.replace(/[^0-9,.-]/g, '').replace(',', '.'));
        console.log(`Precio convertido: $${precioConvertido}`);
        return precioConvertido;
    }

    let datosUsuario = obtenerDatosUsuario();
    let precioProducto = limpiarYConvertirPrecio(obtenerEntrada("precioProducto"));
    let cuotas = parseInt(obtenerEntrada("cuotas"));
    console.log(`Cantidad de cuotas seleccionadas: ${cuotas}`);
    let precioPorCuota = calcularCuota(precioProducto, cuotas);

    mostrarMensaje(`Estimad@ ${datosUsuario.nombre}, el precio por cuota para viajar a ${datosUsuario.destino} es: $${precioPorCuota.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);

    let simulacion = { ...datosUsuario, precioProducto, cuotas, precioPorCuota };
    historialSimulaciones.push(simulacion);
    console.log("Simulación añadida al historial:", simulacion);
    mostrarHistorial();
}

// Función para validar ingreso de números sin símbolos
function validarEntradaNumerica(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
    console.log("Entrada numérica validada:", input.value);
}

// Función para mostrar el historial de simulaciones
function mostrarHistorial() {
    let listaHistorial = document.getElementById('listaHistorial');
    listaHistorial.innerHTML = '';

    historialSimulaciones.forEach((simulacion, index) => {
        let item = document.createElement('li');
        item.textContent = `Simulación ${index + 1}: ${simulacion.nombre}, ${simulacion.destino}, $${simulacion.precioPorCuota} por cuota (${simulacion.cuotas} cuotas)`;
        listaHistorial.appendChild(item);
    });
    console.log("Historial actualizado:", historialSimulaciones);
}

// Función para guardar el historial en un archivo *.txt
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
        console.log("Historial guardado como historial_simulaciones.txt.");
    }
}

// Función para reiniciar el simulador/limpiar campos
function reiniciarSimulador() {
    document.getElementById("simuladorCuotas").reset();
    document.getElementById('resultado').textContent = '';
    document.getElementById('listaHistorial').innerHTML = '';
    document.getElementById('buscarDestino').value = '';
    document.getElementById('listaResultados').innerHTML = '';
    console.log("Simulador reiniciado.");
}

// Función para buscar simulaciones por destino
function buscarPorDestino() {
    let destinoBuscado = document.getElementById('buscarDestino').value.trim();
    let resultados = filtrarPorDestino(destinoBuscado);

    let listaResultados = document.getElementById('listaResultados');
    listaResultados.innerHTML = '';

    if (resultados.length > 0) {
        resultados.forEach((simulacion, index) => {
            let item = document.createElement('li');
            item.textContent = `Simulación ${index + 1}: ${simulacion.nombre}, ${simulacion.destino}, $${simulacion.precioPorCuota} por cuota (${simulacion.cuotas} cuotas)`;
            listaResultados.appendChild(item);
        });
        console.log("Resultados de búsqueda mostrados:", resultados);
    } else {
        alert("No encontramos simulaciones para el destino ingresado.");
        console.log("No se encontraron simulaciones para el destino buscado:", destinoBuscado);
    }
}

// Función para filtrar simulaciones por destino
function filtrarPorDestino(destinoBuscado) {
    let resultados = historialSimulaciones.filter(simulacion => simulacion.destino.toLowerCase() === destinoBuscado.toLowerCase());
    console.log(`Simulaciones filtradas por destino (${destinoBuscado}):`, resultados);
    return resultados;
}
