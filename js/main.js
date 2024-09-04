// Array para almacenar el historial de simulaciones
let historialSimulaciones = [];

// Función principal del simulador de cuotas
function simuladorCuotas() {

    const obtenerEntrada = (id) => document.getElementById(id).value;

    const mostrarMensaje = (mensaje) => {
        document.getElementById('resultado').textContent = mensaje;
    };

    const calcularCuotaConInteres = (precio, cuotas, interesAnual) => {
        const interesMensual = interesAnual / 12 / 100;
        const cuota = precio * interesMensual / (1 - Math.pow(1 + interesMensual, -cuotas));
        return Math.round(cuota);
    };

    //Ejercicio: incluír operadores ternarios
    const calcularCuota = (precio, cuotas) => {

        const tasasInteres = { 9: 24.85, 12: 34.22 };

        const interes = tasasInteres[cuotas] || 0;
        return interes
            ? calcularCuotaConInteres(precio, cuotas, interes)
            : Math.round(precio / cuotas);
    };

    const obtenerDatosUsuario = () => {
        return {
            nombre: obtenerEntrada("nombre"),
            edad: obtenerEntrada("edad"),
            destino: obtenerEntrada("destino")
        };
    };

    const limpiarYConvertirPrecio = (precio) => {
        return parseFloat(precio.replace(/[^0-9,.-]/g, '').replace(',', '.'));
    };

    const datosUsuario = obtenerDatosUsuario();

    const precioProducto = limpiarYConvertirPrecio(obtenerEntrada("precioProducto"));
    const cuotas = parseInt(obtenerEntrada("cuotas"));
    const precioPorCuota = calcularCuota(precioProducto, cuotas);
    const precioTotal = cuotas === 9 || cuotas === 12
        ? precioProducto * (1 + (cuotas === 9 ? 0.2485 : 0.3422))
        : precioProducto;

    let resultado = `Hola ${datosUsuario.nombre}, el precio total del viaje a ${datosUsuario.destino} es de $${precioTotal.toFixed(2)}. Pagás ${cuotas} cuotas de $${precioPorCuota.toFixed(2)} cada una.`;
    mostrarMensaje(resultado);

    // Agregar al historial
    const simulacion = { ...datosUsuario, precioProducto, cuotas, precioPorCuota, precioTotal };
    historialSimulaciones.push(simulacion);

    guardarHistorialLocalStorage();
    mostrarHistorial();
}

// Función para reiniciar el simulador/limpiar campos
function reiniciarSimulador() {
    document.getElementById("simuladorCuotas").reset();
    document.getElementById('resultado').textContent = '';
    document.getElementById('listaHistorial').innerHTML = '';
    document.getElementById('buscarDestino').value = '';
    document.getElementById('listaResultados').innerHTML = '';

    // Limpiar almacenamiento local
    localStorage.removeItem('datosUsuario');
    localStorage.removeItem('historialSimulaciones');
    historialSimulaciones = [];
}

// Función para validar ingreso de números sin símbolos
function validarEntradaNumerica(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

// Función para agregar al historial
function agregarAlHistorial(nombre, edad, destino, precioProducto, cuotas, precioTotal) {
    let listaHistorial = document.getElementById('listaHistorial');
    let li = document.createElement('li');
    li.textContent = `${nombre}, ${edad} años - Viaje a ${destino} (${precioProducto}): $${precioTotal.toFixed(2)} en ${cuotas} cuotas.`;
    listaHistorial.appendChild(li);

    // Guardar en el historial de simulaciones
    historialSimulaciones.push({ nombre, edad, destino, precioProducto, cuotas, precioTotal });
    guardarHistorialLocalStorage();
}

// Función para guardar el historial y los inputs en localStorage
function guardarHistorialLocalStorage() {
    localStorage.setItem('historialSimulaciones', JSON.stringify(historialSimulaciones));

    // Guardar inputs en localStorage
    const datosUsuario = {
        nombre: document.getElementById('nombre').value,
        edad: document.getElementById('edad').value,
        destino: document.getElementById('destino').value,
        precioProducto: document.getElementById('precioProducto').value,
        cuotas: document.getElementById('cuotas').value
    };
    localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));
}

// Función para integrar SweetAlert y Toastify
function buscarPorDestino() {
    const destinoBuscado = normalizarTexto(document.getElementById('buscarDestino').value.trim());
    const resultados = filtrarPorDestino(destinoBuscado);

    const listaResultados = document.getElementById('listaResultados');
    listaResultados.innerHTML = '';

    if (resultados.length > 0) {
        resultados.forEach((simulacion, index) => {
            const item = document.createElement('li');
            item.textContent = `Resultados ${index + 1}: ${simulacion.nombre}, ${simulacion.destino}, $${simulacion.precioPorCuota} por cuota (${simulacion.cuotas} cuotas)`;
            item.style.marginTop = '20px';
            listaResultados.appendChild(item);
        });

        Toastify({
            text: "Resultados encontrados!",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#EA4D37",
                color: "#FFF9EA",
                fontFamily: "'Quicksand', sans-serif",
                borderRadius: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }
        }).showToast();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Parece que algo salió mal :(',
            text: 'No encontramos resultados para el destino ingresado.',
            confirmButtonText: 'Entendido',
            customClass: {
                container: 'swal-container',
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-confirm-button'
            },
            buttonsStyling: false,
            background: '#ffffff',
            color: '#0D2D36',
            confirmButtonColor: '#EA4D37',
            confirmButtonText: 'Entendido'
        });
    }
}

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Función para filtrar simulaciones por destino
const filtrarPorDestino = (destinoBuscado) => {
    return historialSimulaciones.filter(({ destino }) =>
        normalizarTexto(destino).includes(destinoBuscado)
    );
};

// Función para guardar el historial en un archivo de texto (.txt)
function guardarHistorialComoTxt() {
    if (historialSimulaciones.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Historial vacío',
            text: 'No hay simulaciones en el historial para guardar.',
            confirmButtonText: 'Entendido',
            customClass: {
                container: 'swal-container',
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-confirm-button'
            },
            buttonsStyling: false,
            background: '#ffffff',
            color: '#0D2D36',
            confirmButtonColor: '#EA4D37',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    const contenidoHistorial = historialSimulaciones.map((simulacion, index) =>
        `Simulación ${index + 1}: ${simulacion.nombre}, ${simulacion.destino}, $${simulacion.precioPorCuota} por cuota (${simulacion.cuotas} cuotas)`
    ).join('\n');

    // Función para crear un blob con el contenido del historial
    const blob = new Blob([contenidoHistorial], { type: 'text/plain;charset=utf-8' });

    // Función para crear un enlace para la descarga del archivo
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'historial_simulaciones.txt';
    enlace.click();

    // Liberar el objeto URL creado
    URL.revokeObjectURL(enlace.href);

}

// Función para ingresar el precio desde las cards
function consultarPrecio(destino, noches, precio) {
    document.getElementById('destino').value = destino;
    document.getElementById('precioProducto').value = precio;
    Toastify({
        text: `El precio para ${destino} (${noches}) es $${precio}`,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
            background: "#EA4D37",
            color: "#FFF9EA",
            fontFamily: "'Quicksand', sans-serif",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
    }).showToast();
}

// Función para consultar la oferta del día desde un archivo JSON
function consultarOferta() {
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            const randomIndex = Math.floor(Math.random() * data.length);
            const oferta = data[randomIndex];

            document.getElementById('ofertaDescripcion').innerHTML = `¡Oferta especial en ${oferta.destino} por ${oferta.noches}! Precio: $${oferta.precio}`;

            document.getElementById('destino').value = oferta.destino;
            document.getElementById('precioProducto').value = oferta.precio;

            Toastify({
                text: `La oferta del día es ${oferta.destino} (${oferta.noches}) por $${oferta.precio}`,
                close: true,
                gravity: 'top',
                position: 'right',
                style: {
                    background: "#EA4D37",
                    color: "#FFF9EA",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                },
            }).showToast();
        })
        .catch(error => console.error('Error al cargar la oferta:', error));
}

// Función para recuperar datos desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const historialGuardado = localStorage.getItem('historialSimulaciones');
    if (historialGuardado) {
        historialSimulaciones = JSON.parse(historialGuardado);
    }

    const datosUsuarioGuardados = localStorage.getItem('datosUsuario');
    if (datosUsuarioGuardados) {
        const { nombre, edad, destino, precioProducto, cuotas } = JSON.parse(datosUsuarioGuardados);
        document.getElementById('nombre').value = nombre || '';
        document.getElementById('edad').value = edad || '';
        document.getElementById('destino').value = destino || '';
        document.getElementById('precioProducto').value = precioProducto || '';
        document.getElementById('cuotas').value = cuotas || '';
    }

    mostrarHistorial();
});

// Función para mostrar historial en la interfaz
function mostrarHistorial() {
    const listaHistorial = document.getElementById('listaHistorial');
    listaHistorial.innerHTML = '';

    historialSimulaciones.forEach((simulacion, index) => {
        const li = document.createElement('li');
        li.textContent = `Simulación ${index + 1}: ${simulacion.nombre}, ${simulacion.destino}, $${simulacion.precioPorCuota} por cuota (${simulacion.cuotas} cuotas)`;
        listaHistorial.appendChild(li);
    });
}

// Función para mostrar el botón de volver arriba cuando el usuario se desplaza hacia abajo
window.addEventListener('scroll', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Función para volver a la parte superior de la página
document.getElementById('scrollToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Función para manejo de envío del formulario de suscripción
document.getElementById('subscriptionForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;

    Swal.fire({
        icon: 'success',
        title: '¡Suscripción exitosa!',
        text: 'Gracias por suscribirte.',
        confirmButtonText: 'Aceptar',
        customClass: {
            container: 'swal-container',
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content',
            confirmButton: 'swal-confirm-button'
        },
        buttonsStyling: false,
        background: '#ffffff',
        color: '#0D2D36',
        confirmButtonColor: '#EA4D37'
    });

    document.getElementById('email').value = '';
});