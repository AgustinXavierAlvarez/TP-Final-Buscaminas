var saludo = document.querySelector('.saludo');
var niveles = document.querySelector('.niveles-container');
var btnJugar = document.querySelector('#start-game');
var btnSalir = document.querySelector('#exit-game');
var btnNiveles = document.getElementsByClassName('btn-lvl');
var tableroContainer = document.getElementsByClassName('tablero-container');
var tablero = document.querySelector('#tablero');
var btnReiniciar = document.querySelector('#reiniciar-juego');
var temporizador = document.querySelector('#temporizador');
var btnReiniciar = document.querySelector('#reiniciar-juego');
var btnPuntajes = document.querySelector('.btn-puntaje');
var containerPuntaje = document.querySelector('#puntajes-container');
var contPuntaje = 0;
let matrizJuego;
let visitado;
let tiempo = 0;
let intervaloTemporizador = null;
let temporizadorActivo = false;
let primerClick = true;
let juegoTerminado = false;

document.addEventListener('DOMContentLoaded', function() {
    saludo.classList.add('visualize-block');
    niveles.classList.add('hidden-block');
    tableroContainer[0].classList.add('hidden-block');
    containerPuntaje.classList.add('hidden-block');
});

btnJugar.addEventListener('click', function() {
    saludo.classList.remove('visualize-block');
    saludo.classList.add('hidden-block');
    niveles.classList.remove('hidden-block');
});

btnSalir.addEventListener('click', function() {
    saludo.classList.remove('hidden-block');
    niveles.classList.add('hidden-block');
});

btnReiniciar.addEventListener('click', function() {
    if (contPuntaje > 0 && !juegoTerminado) {
        let confirmar = confirm("Si reinicias ahora, perderás los puntos de esta partida. ¿Quieres guardar tu puntaje antes de reiniciar?");
        if (confirmar) {
            pedirDatosJugador(function(documento, nombre) {
                let nivel = '';
                if (matrizJuego.length === 6) nivel = 'facil';
                else if (matrizJuego.length === 8) nivel = 'medio';
                else if (matrizJuego.length === 10) nivel = 'dificil';
                guardarPuntaje(nivel, documento, nombre, contPuntaje);
                alert("¡Puntaje guardado!");
                // Ahora sí, reinicia el juego
                reiniciarJuego();
            });
            return; // Espera a que termine el guardado
        }
    }
    reiniciarJuego();
});

function reiniciarJuego() {
    juegoTerminado = false;
    contPuntaje = 0;
    niveles.classList.remove('hidden-block');
    tableroContainer[0].classList.add('hidden-block');
    tablero.innerHTML = '';
    temporizador.textContent = 'Tiempo: 00s';
    actualizarPuntaje();
    detenerTemporizador();
}

btnNiveles[0].addEventListener('click', function() {
    crearTablero(6, 6, 7);
    niveles.classList.add('hidden-block');
    tableroContainer[0].classList.remove('hidden-block');
});

btnNiveles[1].addEventListener('click', function() {
    crearTablero(8, 8, 10);
    niveles.classList.add('hidden-block');
    tableroContainer[0].classList.remove('hidden-block');
});

btnNiveles[2].addEventListener('click', function() {
    crearTablero(10, 10, 20);
    niveles.classList.add('hidden-block');
    tableroContainer[0].classList.remove('hidden-block');
});

function actualizarPuntaje() {
    puntaje.textContent = `Puntaje: ${contPuntaje < 10 ? '00' : ''}${contPuntaje}`;
}

function pedirDatosJugador(informacion) {
    let documento = prompt("Ingrese su número de documento:");
    let nombre = prompt("Ingrese su nombre:");
    if (documento && nombre) {
        informacion(documento, nombre);
    }else {
        let confirmar = confirm("No ingresaste nombre o documento. Si continúas, ¡PERDERÁS los puntos de esta partida!\n¿Estás seguro de que no quieres guardar tu puntaje?");
        if (!confirmar) {
            pedirDatosJugador(informacion);
        } else {
            alert("Tus puntos NO serán guardados.");
        }
    }
}

function guardarPuntaje(nivel, documento, nombre, puntaje) {
    let datos = JSON.parse(localStorage.getItem('puntajes')) || { facil: [], medio: [], dificil: [] };

    // Busca si ya existe ese documento en el nivel
    let idx = datos[nivel].findIndex(p => p.documento === documento);
    if (idx !== -1) {
        // Si el nuevo puntaje es mayor, actualiza
        if (puntaje > datos[nivel][idx].puntaje) {
            datos[nivel][idx].puntaje = puntaje;
            datos[nivel][idx].nombre = nombre;
        }
    } else {
        datos[nivel].push({ documento, nombre, puntaje });
    }

    // Ordena y deja solo top 5
    datos[nivel].sort((a, b) => b.puntaje - a.puntaje);
    datos[nivel] = datos[nivel].slice(0, 5);

    localStorage.setItem('puntajes', JSON.stringify(datos));
}

function obtenerTopGlobal() {
    let datos = JSON.parse(localStorage.getItem('puntajes')) || { facil: [], medio: [], dificil: [] };
    let global = {};

    ['facil', 'medio', 'dificil'].forEach(nivel => {
        datos[nivel].forEach(p => {
            if (!global[p.documento]) {
                global[p.documento] = { documento: p.documento, nombre: p.nombre, puntaje: 0 };
            }
            global[p.documento].puntaje += p.puntaje;
        });
    });

    // Convierte a array y ordena
    let topGlobal = Object.values(global).sort((a, b) => b.puntaje - a.puntaje).slice(0, 5);
    return topGlobal;
}


function iniciarTemporizador() {
    if (temporizadorActivo) return;
    temporizadorActivo = true;
    tiempo = 0;
    temporizador.textContent = 'Tiempo: 00s';
    intervaloTemporizador = setInterval(() => {
        tiempo++;
        temporizador.textContent = tiempo < 10 ? `Tiempo: 0${tiempo} s` : `Tiempo: ${tiempo} s`;
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
        setTimeout(() => {
            alert('¡Felicidades! Ganaste el juego.');
        }, 100);
        detenerTemporizador();
        pedirDatosJugador(function(documento, nombre) {
        // Detecta el nivel actual según el tamaño del tablero
            let nivel = '';
            if (matrizJuego.length === 6) nivel = 'facil';
            else if (matrizJuego.length === 8) nivel = 'medio';
            else if (matrizJuego.length === 10) nivel = 'dificil';
            guardarPuntaje(nivel, documento, nombre, contPuntaje);
            alert('¡Felicidades! Ganaste el juego.');
        });
        document.querySelectorAll('.celda').forEach(btn => btn.disabled = true);
        juegoTerminado = true;
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
        [-1, -1], [-1, 0], [-1, 1], [0, -1],
        [0, 1], [1, -1], [1, 0], [1, 1]
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
        if (!celda.classList.contains('descubierta')) {
            contPuntaje += 20;
            actualizarPuntaje();
        }
        celda.classList.add('descubierta');
        verificarVictoria();
        if (bombasAlrededor > 0) {
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
    console.log(JSON.parse(JSON.stringify(matriz)));
    console.log(matriz);
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
                        celda.textContent = '';
                    } else if (celda.textContent === '') {
                        celda.textContent = '🚩';
                    }
                }
            });
            celda.addEventListener('click', function() {
                if (juegoTerminado) return;
                const i = parseInt(celda.dataset.fila);
                const j = parseInt(celda.dataset.columna);
                if (primerClick) {
                    primerClick = false;
                    iniciarTemporizador();
                    while (matrizJuego[i][j] === 'B') {
                        matrizJuego = generarMatriz(matrizJuego.length, matrizJuego[0].length,matrizJuego.flat().filter(x => x === 'B').length);
                    }
                }
                if (matrizJuego[i][j] === 'B') {
                    celda.textContent = '💣';
                    celda.classList.add('bomba');
                    alert('¡Perdiste! Pisaste una bomba.');
                    pedirDatosJugador(function(documento, nombre) {
                        // Detecta el nivel actual según el tamaño del tablero
                        let nivel = '';
                        if (matrizJuego.length === 6) nivel = 'facil';
                        else if (matrizJuego.length === 8) nivel = 'medio';
                        else if (matrizJuego.length === 10) nivel = 'dificil';
                        guardarPuntaje(nivel, documento, nombre, contPuntaje);
                    });
                    detenerTemporizador();
                    mostrarTodasLasBombas();
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
        }
        tablero.appendChild(fila);
    }
}


