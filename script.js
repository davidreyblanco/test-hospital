// Funcionalidades para el directorio del personal
function filtrarTabla() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const filtroDepartamento = document.getElementById('filtro-departamento').value;
    const filtroCategoria = document.getElementById('filtro-categoria').value;
    const tabla = document.getElementById('tabla-empleados');
    const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let contador = 0;

    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const celdas = fila.getElementsByTagName('td');
        
        let mostrarFila = true;
        
        // Filtro de búsqueda por texto
        if (busqueda) {
            const textoFila = (celdas[0].textContent + ' ' + celdas[2].textContent).toLowerCase();
            if (!textoFila.includes(busqueda)) {
                mostrarFila = false;
            }
        }
        
        // Filtro por departamento
        if (filtroDepartamento && mostrarFila) {
            if (celdas[1].textContent !== filtroDepartamento) {
                mostrarFila = false;
            }
        }
        
        // Filtro por categoría
        if (filtroCategoria && mostrarFila) {
            if (celdas[2].textContent !== filtroCategoria) {
                mostrarFila = false;
            }
        }
        
        // Mostrar u ocultar fila
        if (mostrarFila) {
            fila.style.display = '';
            contador++;
        } else {
            fila.style.display = 'none';
        }
    }
    
    // Actualizar contador
    document.getElementById('empleados-mostrados').textContent = contador;
}

function ordenar(columna) {
    const tabla = document.getElementById('tabla-empleados');
    const tbody = tabla.getElementsByTagName('tbody')[0];
    const filas = Array.from(tbody.getElementsByTagName('tr'));
    
    // Determinar dirección de ordenación
    const esAscendente = tabla.getAttribute('data-orden') !== 'desc';
    tabla.setAttribute('data-orden', esAscendente ? 'desc' : 'asc');
    
    // Ordenar filas
    filas.sort((a, b) => {
        const valorA = a.getElementsByTagName('td')[columna].textContent.trim();
        const valorB = b.getElementsByTagName('td')[columna].textContent.trim();
        
        if (esAscendente) {
            return valorA.localeCompare(valorB);
        } else {
            return valorB.localeCompare(valorA);
        }
    });
    
    // Reinsertar filas ordenadas
    filas.forEach(fila => tbody.appendChild(fila));
    
    // Actualizar indicadores visuales de ordenación
    const cabeceras = tabla.getElementsByTagName('th');
    for (let i = 0; i < cabeceras.length; i++) {
        cabeceras[i].classList.remove('orden-asc', 'orden-desc');
    }
    cabeceras[columna].classList.add(esAscendente ? 'orden-asc' : 'orden-desc');
}

// Funcionalidades para formularios
function validarFormulario(event) {
    const form = event.target;
    const campos = form.querySelectorAll('[required]');
    let esValido = true;
    
    for (let campo of campos) {
        if (!campo.value.trim()) {
            campo.classList.add('error');
            esValido = false;
        } else {
            campo.classList.remove('error');
        }
    }
    
    // Validación específica para emails
    const emails = form.querySelectorAll('input[type="email"]');
    for (let email of emails) {
        if (email.value && !email.value.includes('@')) {
            email.classList.add('error');
            esValido = false;
        }
    }
    
    if (!esValido) {
        event.preventDefault();
        mostrarNotificacion('Por favor, complete todos los campos requeridos correctamente.', 'error');
    }
    
    return esValido;
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Añadir estilos si no existen
    if (!document.querySelector('#notificaciones-styles')) {
        const estilos = document.createElement('style');
        estilos.id = 'notificaciones-styles';
        estilos.textContent = `
            .notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 300px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .notificacion.info { background-color: #007bff; }
            .notificacion.success { background-color: #28a745; }
            .notificacion.warning { background-color: #ffc107; color: #212529; }
            .notificacion.error { background-color: #dc3545; }
            .notificacion button {
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                margin-left: auto;
            }
        `;
        document.head.appendChild(estilos);
    }
    
    // Añadir al DOM
    document.body.appendChild(notificacion);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

// Funcionalidad de búsqueda global (para implementar en el futuro)
function buscarGlobal(termino) {
    if (termino.length < 2) return;
    
    // Esta función se puede expandir para buscar en toda la intranet
    console.log('Búsqueda global:', termino);
    mostrarNotificacion(`Buscando: "${termino}"`, 'info');
}

// Funcionalidad para modales
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Funcionalidad para tablas interactivas
function exportarTablaCSV(nombreArchivo, idTabla) {
    const tabla = document.getElementById(idTabla);
    if (!tabla) return;
    
    let csv = [];
    const filas = tabla.getElementsByTagName('tr');
    
    for (let i = 0; i < filas.length; i++) {
        const fila = [];
        const celdas = filas[i].getElementsByTagName(i === 0 ? 'th' : 'td');
        
        for (let j = 0; j < celdas.length; j++) {
            let texto = celdas[j].textContent.trim();
            // Escapar comillas y envolver en comillas si contiene comas
            if (texto.includes(',') || texto.includes('"')) {
                texto = '"' + texto.replace(/"/g, '""') + '"';
            }
            fila.push(texto);
        }
        csv.push(fila.join(','));
    }
    
    // Crear y descargar archivo
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${nombreArchivo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    mostrarNotificacion('Archivo CSV exportado correctamente', 'success');
}

// Funcionalidad para tabs/pestañas
function cambiarTab(id) {
    // Ocultar todas las tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.style.display = 'none');
    
    // Mostrar tab seleccionada
    const tabSeleccionada = document.getElementById(id);
    if (tabSeleccionada) {
        tabSeleccionada.style.display = 'block';
    }
    
    // Actualizar navegación
    const botones = document.querySelectorAll('.tab-nav button');
    botones.forEach(boton => boton.classList.remove('active'));
    const botonActivo = document.querySelector(`[onclick="cambiarTab('${id}')"]`);
    if (botonActivo) {
        botonActivo.classList.add('active');
    }
}

// Funcionalidad para contador de caracteres en textarea
function actualizarContador(id) {
    const textarea = document.getElementById(id);
    if (textarea) {
        const contador = document.getElementById(`contador-${id}`);
        if (contador) {
            contador.textContent = `${textarea.value.length} caracteres`;
        }
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Añadir listeners a formularios
    const formularios = document.querySelectorAll('form');
    formularios.forEach(form => {
        form.addEventListener('submit', validarFormulario);
    });
    
    // Añadir validación en tiempo real a campos requeridos
    const campos = document.querySelectorAll('[required]');
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });
    
    // Cerrar modales al hacer clic fuera
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal(this.id);
            }
        });
    });
    
    // Escape para cerrar modales
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modalesAbiertos = document.querySelectorAll('.modal[style*="block"]');
            modalesAbiertos.forEach(modal => cerrarModal(modal.id));
        }
    });
    
    // Mostrar notificación de bienvenida en páginas específicas
    if (window.location.pathname.includes('directorio.html')) {
        setTimeout(() => {
            mostrarNotificacion('Use los filtros para encontrar empleados específicos', 'info');
        }, 1000);
    }
});

// Funciones de utilidad para fechas
function formatearFecha(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function calcularDiferenciaFechas(fecha1, fecha2) {
    const milisegundosPorDia = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((fecha1 - fecha2) / milisegundosPorDia));
}

// Funcionalidad para calendario simple
function generarCalendario(mes, año) {
    const primerDia = new Date(año, mes, 1).getDay();
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    let calendario = `<h3>${nombresMeses[mes]} ${año}</h3>`;
    calendario += '<table class="calendario"><tr><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th></tr><tr>';
    
    for (let i = 0; i < primerDia; i++) {
        calendario += '<td></td>';
    }
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
        if ((dia + primerDia - 1) % 7 === 0) {
            calendario += '</tr><tr>';
        }
        calendario += `<td onclick="seleccionarDia(${dia}, ${mes}, ${año})">${dia}</td>`;
    }
    
    calendario += '</tr></table>';
    return calendario;
}

function seleccionarDia(dia, mes, año) {
    mostrarNotificacion(`Día seleccionado: ${dia}/${mes + 1}/${año}`, 'success');
}

// Exportar funciones para uso global
window.filtrarTabla = filtrarTabla;
window.ordenar = ordenar;
window.validarFormulario = validarFormulario;
window.mostrarNotificacion = mostrarNotificacion;
window.buscarGlobal = buscarGlobal;
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.exportarTablaCSV = exportarTablaCSV;
window.cambiarTab = cambiarTab;
window.actualizarContador = actualizarContador;
window.formatearFecha = formatearFecha;
window.calcularDiferenciaFechas = calcularDiferenciaFechas;
window.generarCalendario = generarCalendario;
window.seleccionarDia = seleccionarDia;
