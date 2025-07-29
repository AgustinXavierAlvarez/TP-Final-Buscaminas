var saludo = document.querySelector('.saludo');
var header = document.querySelector('.header');
var headTablero = document.querySelector('.head-tablero');
var modeByw = document.querySelector('.mode-byw');
var footer = document.querySelector('.footer');
var btns= document.querySelectorAll('.btn-juego');
var niveles = document.querySelector('.niveles-container');
var btnJugar = document.querySelector('#start-game');
var btnSalir = document.getElementsByClassName('exit-game');
var btnNiveles = document.getElementsByClassName('btn-lvl');
var btnInstrucciones = document.querySelector('#btn-instrucciones');
var btnContacto = document.querySelector('#btn-contacto');
var btnPuntajes = document.querySelector('#btn-puntajes');
var btnsPuntajes = document.querySelectorAll('.btn-puntaje');
var btnReiniciar = document.querySelector('#reiniciar-juego');
var instrucciones = document.querySelector('#instrucciones');
var contactoContainer = document.querySelector('.contacto-container');
var formContacto = document.querySelector('#contacto-form');
var btnForm= document.querySelector('#btn-form');
var catPuntajesConatainer = document.querySelector('.cat-puntajes-container');
var puntajesContainer = document.querySelector('.puntajes-container')
var modalGuardado = document.querySelector('#modal-guardado');
var tableroContainer = document.querySelector('.tablero-container');
var tablero = document.querySelector('#tablero');
var temporizador = document.querySelector('#temporizador');
var contadorBanderas = document.querySelector('#minas-restantes');
var exitCross = document.querySelector('#exit-cross');
var alertModal = document.querySelector('#modal-alert');
let matrizJuego;
let visitado;
let tiempo = 0;
var contBanderas= 0;
var nivelJuego = undefined
let intervaloTemporizador = null;
let temporizadorActivo = false;
let primerClick = true;
let juegoTerminado = false;

document.addEventListener('DOMContentLoaded', function() {
    saludo.classList.toggle('visualize-block');
});

function alertFunction(type, message) {
    var [modalGuardado,modelContent] = document.getElementsByClassName('modal-content')
    let alertMessage = document.createElement('p');
    var titulo = document.createElement('h1');
    var divModal = document.createElement('div');
    divModal.innerHTML =`<div class="btns-modal"><button class="btn-juego btn-modal" id="btn-confirmar">Si</button><button class="btn-juego btn-modal" id="btn-denegar">No</button></div>`;
    alertModal.classList.add('visualize-block');
    divModal.classList.add('btns-modal');
    alertModal.appendChild(modelContent);
    modelContent.innerHTML = '';
    modelContent.appendChild(titulo);
    modelContent.appendChild(alertMessage);
    modelContent.appendChild(divModal);
    alertMessage.textContent = message;
    var btnConfirmar = document.querySelector('#btn-confirmar');
    var btnDenegar = document.querySelector('#btn-denegar');
    if (modeByw.textContent === '🌙') {
        alertMessage.style.color = '#fff !important';
        btnConfirmar.classList.add('dark-mode-button');
        btnDenegar.classList.add('dark-mode-button');
    }else {
        alertMessage.style.color = '#333 !important';
        btnConfirmar.classList.remove('dark-mode-button');
        btnDenegar.classList.remove('dark-mode-button');
    }
    if (type == 'error') {
        titulo.textContent = 'Error';
        alertMessage.style.color = '#333';
        btnDenegar.style.display = 'none';    
        btnConfirmar.textContent = 'Aceptar';
    } 
    if (type == 'salir') {
        titulo.textContent = 'Salir del juego';
    }
    if (type == 'victoria') {
        titulo.textContent = '¡¡Victoria!!';
        alertMessage.style.color = '#333';
    }
    if (type == 'perdiste') {
        titulo.textContent= 'Perdiste'+' 😞';
        btnDenegar.style.display = 'none';    
        btnConfirmar.textContent = 'Aceptar';
    }
    btnConfirmar.addEventListener('click', function() {
        alertModal.classList.remove('visualize-block');
        if (type == 'salir') {
            reiniciarJuego();
        }else if (type == 'error') {
            return;
        }else if (type == 'victoria') {
            guardarPuntaje(contBanderas,tiempo,nivelJuego);
        }else if(type== 'perdiste'){
            return;
        }
    });
    btnDenegar.addEventListener('click', function() {
        alertModal.classList.remove('visualize-block');
        if (type == 'victoria') {
            alertFunction('salir','¿Deseas salir del juego?')
        }
        reanudarTemporizador();
    });
}

modeByw.addEventListener('click', function() { 
    var btnModal = document.querySelectorAll('.btn-modal') || [];
    let celdas = document.querySelectorAll('.celda');
    modeByw.classList.toggle('dark-mode-button');
    modeByw.textContent = this.classList.contains('dark-mode-button') ? '🌙' : '🌞';
    celdas.forEach(celda => {  
        celda.classList.toggle('dark-mode-celda');
    });
    if (btnModal.length > 0) {
        btnModal.forEach(btn => {
            btn.classList.toggle('dark-mode-button');
        });
    }
    header.classList.toggle('dark-mode');
    footer.classList.toggle('dark-mode');
    saludo.classList.toggle('dark-mode');
    niveles.classList.toggle('dark-mode');
    btns.forEach(btn => btn.classList.toggle('dark-mode-button'));
    instrucciones.classList.toggle('dark-mode');
    contactoContainer.classList.toggle('dark-mode');
    catPuntajesConatainer.classList.toggle('dark-mode');
    tableroContainer.classList.toggle('dark-mode');
    tablero.classList.toggle('dark-mode');
    modalGuardado.classList.toggle('dark-mode')
    puntajesContainer.classList.toggle('dark-mode')
    headTablero.classList.toggle('dark-mode');
    alertModal.classList.toggle('dark-mode');
    divModal = document.querySelectorAll('.btn-modal');
    if(tablero.classList.contains('dark-mode')) {
        tablero.style.borderTop='3px #3f3f3f solid';
        exitCross.style.borderBottom='3px #3f3f3f solid';
        tablero.style.borderLeft='3px #3f3f3f solid';
    }else{
        tablero.style.borderTop='3px #5b5b5b solid';
        exitCross.style.borderBottom='3px #5b5b5b solid';
        tablero.style.borderLeft='3px #5b5b5b solid';
    }
});

btnJugar.addEventListener('click', function() {
    saludo.classList.toggle('visualize-block');
    niveles.classList.toggle('visualize-block');
});

btnPuntajes.addEventListener('click', function() {
    saludo.classList.toggle('visualize-block');
    catPuntajesConatainer.classList.toggle('visualize-block');
});

btnsPuntajes[0].addEventListener('click', function(e) {
    mostrarPuntaje('Global')
})

btnsPuntajes[1].addEventListener('click',function(){
    mostrarPuntaje('Niveles')
})

btnInstrucciones.addEventListener('click', function() {
    saludo.classList.toggle('visualize-block');
    instrucciones.classList.toggle('visualize-block');
});

btnContacto.addEventListener('click', function() {
    saludo.classList.toggle('visualize-block');
    contactoContainer.classList.toggle('visualize-block');
});

btnForm.addEventListener('click', function(e) {
    e.preventDefault();
    var nombre = document.querySelector('#nombre').value.trim();
    var email = document.querySelector('#email').value.trim();
    var mensaje = document.querySelector('#mensaje').value.trim();
    if (nombre === '' || email === '' || mensaje === '') {
        alertFunction('error', 'Por favor, completa todos los campos.');
        return;
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ ]+$/.test(nombre) || nombre.length < 3) {
        alertFunction('error', 'El nombre debe ser alfanumérico y tener al menos 3 caracteres.');
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alertFunction('error', 'Por favor, ingresa un email válido.');
        return;
    }
    if (mensaje.length <= 5) {
        alertFunction('error', 'El mensaje debe tener más de 5 caracteres.');
        return;
    }
    var asunto = encodeURIComponent('Contacto desde Buscaminas');
    var cuerpo = encodeURIComponent('Nombre: ' + nombre + '\nEmail: ' + email + '\nMensaje: ' + mensaje);
    window.location.href = 'mailto:alvarezagustin@gmail.com?subject=' + asunto + '&body=' + cuerpo;
    document.querySelector('#nombre').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#mensaje').value = '';
})

btnNiveles[0].addEventListener('click', function() {
    nivelJuego = 'Facil';
    crearTablero(6, 6, 7);
    niveles.classList.toggle('visualize-block');
    exitCross.style.left = '122px';
    tableroContainer.classList.toggle('visualize-block');
});

btnNiveles[1].addEventListener('click', function() {
    nivelJuego = 'Intermedio';
    crearTablero(8, 8, 10);
    niveles.classList.toggle('visualize-block');
    exitCross.style.left = '129px';
    tableroContainer.classList.toggle('visualize-block');
});

btnNiveles[2].addEventListener('click', function() {
    nivelJuego = 'Dificil';
    crearTablero(10, 10, 16);
    niveles.classList.toggle('visualize-block');
    exitCross.style.left = '159px';
    tableroContainer.classList.toggle('visualize-block');
});

btnSalir[0].addEventListener('click', function() {
    niveles.classList.toggle('visualize-block');
    saludo.classList.toggle('visualize-block');
});

btnSalir[1].addEventListener('click', function() {
    catPuntajesConatainer.classList.toggle('visualize-block');
    saludo.classList.toggle('visualize-block');
});

btnSalir[2].addEventListener('click',function() {
    puntajesContainer.classList.toggle('visualize-block')
    saludo.classList.toggle('visualize-block');
})

btnSalir[3].addEventListener('click', function() {
    instrucciones.classList.toggle('visualize-block');
    saludo.classList.toggle('visualize-block');
});

btnSalir[4].addEventListener('click', function() {
    contactoContainer.classList.toggle('visualize-block');
    saludo.classList.toggle('visualize-block');
});

exitCross.addEventListener('click', function() {
    if (!juegoTerminado) {
        pausarTemporizador();
        var alert = alertFunction('salir', '¿Estás seguro de que quieres salir?');
        if (!alert) return;
    }
    reiniciarJuego();
});

btnReiniciar.addEventListener('click', function() {
    if (!juegoTerminado) {
        pausarTemporizador();
        var alert = alertFunction('salir', '¿Estás seguro de que quieres salir?');
        if (!alert) return;
    }
    reiniciarJuego()
});

function reiniciarJuego() {
    juegoTerminado = false;
    niveles.classList.add('visualize-block');
    tableroContainer.classList.remove('visualize-block');
    tablero.innerHTML = '';
    btnReiniciar.innerHTML = '😊';
    temporizador.textContent = '000';
    tiempo = 0;
    contBanderas = 0;
    detenerTemporizador();
}

function iniciarTemporizador() {
    if (temporizadorActivo) return;
    temporizadorActivo = true;
    intervaloTemporizador = setInterval(() => {
        tiempo++;
        temporizador.textContent = tiempo < 10 ? `00${tiempo}` : tiempo > 99 ? `${tiempo}`:`0${tiempo}`;
    }, 1000);
}

function pausarTemporizador() {
    clearInterval(intervaloTemporizador);
    temporizadorActivo = false;
}

function reanudarTemporizador() {
    if (temporizadorActivo) return;
    temporizadorActivo = true;
    intervaloTemporizador = setInterval(() => {
        tiempo++;
        temporizador.textContent = tiempo < 10 ? `00${tiempo}` : tiempo > 99 ? `${tiempo}`:`0${tiempo}`;
    }, 1000);
}

function detenerTemporizador() {
    clearInterval(intervaloTemporizador);
    temporizadorActivo = false;
}

function verificarVictoria() {
    let totalCeldas = matrizJuego.length * matrizJuego[0].length;
    let bombas = matrizJuego.flat().filter(x => x === 'B').length;
    let descubiertas = document.querySelectorAll('.celda.descubierta').length;
    if (descubiertas === totalCeldas - bombas) {
        btnReiniciar.innerHTML = '🥳';
        detenerTemporizador();
        juegoTerminado = true;
        document.querySelectorAll('.celda').forEach(btn => btn.disabled = true);
        alertFunction('victoria', '¡Felicidades! Ganaste el juego, ¿Deseas Guardar los puntos?.');
    }
}

function guardarPuntaje(bands, time , level) {
    var divModal = document.querySelectorAll('.modal-content');
    var puntaje = {
        nombre:'',
        banderas: bands,
        tiempo: time,
        nivel: level
    };
    var contentPuntaje = document.createElement('div');
    var contBanderas = document.createElement('p');
    var contTiempo = document.createElement('p');
    var contNivel = document.createElement('p');
    var divNombre = document.createElement('div');
    var buttonGuardar = document.createElement('button');
    divModal[0].innerHTML='';
    buttonGuardar.textContent = 'Guardar';
    buttonGuardar.classList.add('btn-juego', 'btn-modal');
    modalGuardado.classList.toggle('visualize-block');
    contBanderas.textContent = `Banderas: ${bands}`;
    contTiempo.textContent = `Tiempo: ${time}`;
    contNivel.textContent = `Nivel: ${level}`;
    contentPuntaje.appendChild(contBanderas);
    contentPuntaje.appendChild(contTiempo);
    contentPuntaje.appendChild(contNivel);
    contentPuntaje.classList.add('guardar-puntaje')
    divNombre.innerHTML = `<label for="nombre-puntaje">Nombre: </label><input type="text" id="nombre-puntaje" name="nombre" required>`;
    contentPuntaje.appendChild(divNombre);
    contentPuntaje.appendChild(buttonGuardar);
    divModal[0].appendChild(contentPuntaje);
    buttonGuardar.addEventListener('click', () => {
        var puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
        puntaje.nombre= document.getElementById('nombre-puntaje').value;
        if (!puntaje.nombre || '') {
            alertFunction('error', 'Por favor, ingresa tu nombre.');
            return;
        }else{
            puntajes.push(puntaje);
            localStorage.setItem('puntajes', JSON.stringify(puntajes));
            modalGuardado.classList.remove('visualize-block');
            contentPuntaje
            reiniciarJuego()
        }
    });
}

function mostrarPuntaje(type){
    var puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
    var puntajesContent = document.querySelector('.puntajes-content');
    var topGlobal = puntajes
    catPuntajesConatainer.classList.toggle('visualize-block')
    puntajesContainer.classList.add('visualize-block')
    puntajesContent.innerHTML = '';
    if (type === 'Global') {
        let tabla = document.createElement('table');
        topGlobal= puntajes.sort((a, b) => b.banderas - a.banderas ).slice(0, 5);
        tabla.innerHTML = `<tr><th>Nombre/</th><th>Banderas/</th><th>Tiempo/</th><th>Nivel</th></tr>`;
        topGlobal.forEach(p => {
            tabla.innerHTML += `<tr><td>${p.nombre}</td> - <td>${p.banderas}</td> - <td>${p.tiempo}</td> - <td>${p.nivel}</td></tr>`;
        });
        puntajesContent.appendChild(tabla);
    } else if (type === 'Niveles') {
        var niveles = ['Facil', 'Intermedio', 'Dificil'];
        for (var i = 0; i < niveles.length; i++) {
            var tabla = document.createElement('table');
            var titulo = document.createElement('h3');
            var divContent = document.createElement('div');
            titulo.textContent= niveles[i];
            tabla.innerHTML = `<tr><th>Nombre</th> - <th>Banderas</th> - <th>Tiempo</th></tr>`;
            topGlobal.forEach(p => {
                p.nivel==niveles[i]?tabla.innerHTML += `<tr><td>${p.nombre}</td> - <td>${p.banderas}</td> - <td>${p.tiempo}</td></tr>`:'';
            });
            divContent.appendChild(titulo)
            divContent.appendChild(tabla)
            puntajesContent.appendChild(divContent)
        }
    } else {
        alertFunction('error','Algo salio mal :(');
    }
}


function mostrarTodasLasBombas() {
    for (let i = 0; i < matrizJuego.length; i++) {
        for (let j = 0; j < matrizJuego[0].length; j++) {
            if (matrizJuego[i][j] === 'B') {
                let celda = document.querySelector(`.celda[data-fila="${i}"][data-columna="${j}"]`);
                celda.textContent = '💣';
                celda.classList.add('bomba');
                celda.disabled = true;
            }
        }
    }
}

function contarBombasAlrededor(matriz, fila, columna) {
    const filas = matriz.length;
    const columnas = matriz[0].length;
    let total = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let f = fila + i;
            let c = columna + j;
            if (f >= 0 && f < filas && c >= 0 && c < columnas) {
                if (matriz[f][c] === 'B') total++;
            }
        }
    }
    return total;
}

function liberarEspacio(matriz, visitado, fila, columna) {
    const filas = matriz.length;
    const columnas = matriz[0].length;
    const direcciones = [
        [-1, -1], [-1, 0], [-1, 1], 
        [0, -1],[0, 1],
         [1, -1], [1, 0], [1, 1]
    ];
    let cola = [[fila, columna]];
    while (cola.length > 0) {
        let [f, c] = cola.shift();
        if (f < 0 || f >= filas || c < 0 || c >= columnas) continue;
        if (visitado[f][c]) continue;
        visitado[f][c] = true;
        let bombasAlrededor = contarBombasAlrededor(matriz, f, c);
        let celda = document.querySelector(`.celda[data-fila="${f}"][data-columna="${c}"]`);
        celda.disabled = true;
        celda.classList.add('descubierta');
        verificarVictoria();
        if (bombasAlrededor > 0) {
            if (celda.textContent === '🚩') {
                    contBanderas++;
                    contadorBanderas.textContent = contBanderas < 10? contBanderas<0? contBanderas <= (-10)? `${contBanderas}`:`0${contBanderas}`: `00${contBanderas}` :`0${contBanderas}`;  
            }
            celda.textContent = bombasAlrededor;
            celda.setAttribute('data-num', bombasAlrededor);
        } else {
            celda.textContent = '';
            celda.removeAttribute('data-num');
            for (let [df, dc] of direcciones) {
                cola.push([f + df, c + dc]);
            }
        }
    }
}    

function generarMatriz(filas, columnas, bombas) {
    let matriz = Array.from({length: filas}, () => Array(columnas).fill(0));
    let bombasColocadas = 0;
    while (bombasColocadas < bombas) {
        let f = Math.floor(Math.random() * filas);
        let c = Math.floor(Math.random() * columnas);
        if (matriz[f][c] !== 'B') {
            matriz[f][c] = 'B';
            bombasColocadas++;
        }
    }
    return matriz;
}

function crearTablero(filas, columnas, bombas = 10) {
    primerClick = true;
    matrizJuego = generarMatriz(filas, columnas, bombas);
    visitado = Array.from({length: filas}, () => Array(columnas).fill(false));
    tablero.innerHTML = '';
    contBanderas = bombas;
    contadorBanderas.textContent = contBanderas < 10?`00${contBanderas}` :`0${contBanderas}`;
    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('div');
        fila.classList.add('fila');
        for (let j = 0; j < columnas; j++) {
            const celda = document.createElement('button');
            celda.addEventListener('contextmenu', function(e) {
                if (juegoTerminado) return;
                e.preventDefault();
                if (!celda.disabled) {
                    if (celda.textContent === '🚩') {
                        contBanderas++;
                        contadorBanderas.textContent =contBanderas < 10? contBanderas<0? contBanderas <= (-10)? `${contBanderas}`:`0${contBanderas}`: `00${contBanderas}` :`0${contBanderas}`;
                        celda.textContent = '';
                    } else if (celda.textContent === '') {
                        contBanderas--;
                        contadorBanderas.textContent = contBanderas < 10? contBanderas<0? contBanderas <= (-10)? `${contBanderas}`:`0${contBanderas}`: `00${contBanderas}` :`0${contBanderas}`;
                        celda.textContent = '🚩';
                    }
                }
            });
            celda.addEventListener('mousedown', function(e) {
                btnReiniciar.innerHTML = '😮';
            });
            celda.addEventListener('mouseup', function(e) {
                btnReiniciar.innerHTML = '😊';
            });
            celda.addEventListener('click', function() {
                if (juegoTerminado) return;
                const i = parseInt(celda.dataset.fila);
                const j = parseInt(celda.dataset.columna);
                if (primerClick) {
                    primerClick = false;
                    iniciarTemporizador();
                    while (matrizJuego[i][j] === 'B') {
                        matrizJuego = generarMatriz(filas,columnas,bombas);
                    }
                }
                if (matrizJuego[i][j] === 'B') {
                    btnReiniciar.innerHTML = '🤯';
                    celda.textContent = '💣';
                    celda.classList.add('bomba');
                    detenerTemporizador();
                    mostrarTodasLasBombas();
                    alertFunction('perdiste','¡Perdiste! Pisaste una bomba, apreta la "X" o el icono para salir.');
                    document.querySelectorAll('.celda').forEach(btn => btn.disabled = true);
                    juegoTerminado = true;
                }else {
                    liberarEspacio(matrizJuego, visitado, i, j);
                }
            });
            celda.classList.add('celda');
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            fila.appendChild(celda);
             if (tableroContainer.classList.contains('dark-mode-tablero')) {
                celda.classList.add('dark-mode-celda');
                celda.style.borderBottom = '3px #3f3f3f solid';
                celda.style.borderRight = '3px #3f3f3f solid';
            } else {
                celda.classList.remove('dark-mode-celda');
                celda.style.borderBottom = '2px #5b5b5b solid';
                celda.style.borderRight = '2px #5b5b5b solid';
            }
        }
        tablero.appendChild(fila);
    }
}