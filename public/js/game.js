var saludo = document.querySelector('.saludo');
var niveles = document.querySelector('.niveles-container');
var btnJugar = document.querySelector('#start-game');
var btnSalir = document.getElementsByClassName('exit-game');
var btnNiveles = document.getElementsByClassName('btn-lvl');
var tableroContainer = document.querySelector('.tablero-container');
var tablero = document.querySelector('#tablero');
var instrucciones = document.querySelector('#instrucciones');
var btnInstrucciones = document.querySelector('#btn-instrucciones');
var btnReiniciar = document.querySelector('#reiniciar-juego');
var temporizador = document.querySelector('#temporizador');
var btnReiniciar = document.querySelector('#reiniciar-juego');
var containerPuntaje = document.querySelector('.puntajes-container');
var contadorBanderas = document.querySelector('#banderas-restantes');
let matrizJuego;
let visitado;
let tiempo = 0;
let intervaloTemporizador = null;
let temporizadorActivo = false;
let primerClick = true;
let juegoTerminado = false;


document.addEventListener('DOMContentLoaded', function() {
    niveles.classList.add('hidden-block');
    tableroContainer.classList.add('hidden-block');
    instrucciones.classList.add('hidden-block');
    if (containerPuntaje) containerPuntaje.classList.add('hidden-block');
    saludo.classList.add('visualize-block');
});
btnJugar.addEventListener('click', function() {
    saludo.classList.toggle('hidden-block');
    saludo.classList.toggle('visualize-block');
    niveles.classList.toggle('hidden-block');
    niveles.classList.toggle('visualize-block');
});

btnInstrucciones.addEventListener('click', function() {
    saludo.classList.toggle('hidden-block');
    saludo.classList.toggle('visualize-block');
    instrucciones.classList.toggle('hidden-block');
    instrucciones.classList.toggle('visualize-block');
});

btnSalir[0].addEventListener('click', function() {
    niveles.classList.toggle('hidden-block');
    niveles.classList.toggle('visualize-block');
    saludo.classList.toggle('hidden-block');
    saludo.classList.toggle('visualize-block');
});

btnSalir[1].addEventListener('click', function() {
    containerPuntaje.classList.toggle('hidden-block');
    containerPuntaje.classList.toggle('visualize-block');
    saludo.classList.toggle('hidden-block');
    saludo.classList.toggle('visualize-block');
});

btnSalir[2].addEventListener('click', function() {
    instrucciones.classList.toggle('hidden-block');
    instrucciones.classList.toggle('visualize-block');
    saludo.classList.toggle('hidden-block');
    saludo.classList.toggle('visualize-block');
});

btnReiniciar.addEventListener('click', function() {
    if (!juegoTerminado) {
        let confirmar = confirm("¿Estás seguro de que quieres reiniciar el juego?");
        if (!confirmar) return;
    }
    reiniciarJuego();
});

function reiniciarJuego() {
    juegoTerminado = false;
    niveles.classList.remove('hidden-block');
    niveles.classList.add('visualize-block');
    tableroContainer.classList.remove('visualize-block');
    tableroContainer.classList.add('hidden-block');
    tablero.innerHTML = '';
    temporizador.textContent = '000';
    detenerTemporizador();
}

btnNiveles[0].addEventListener('click', function() {
    crearTablero(6, 6, 7);
    niveles.classList.toggle('hidden-block');
    niveles.classList.toggle('visualize-block');
    tableroContainer.classList.toggle('hidden-block');
    tableroContainer.classList.toggle('visualize-block');
});

btnNiveles[1].addEventListener('click', function() {
    crearTablero(8, 8, 10);
    niveles.classList.toggle('hidden-block');
    niveles.classList.toggle('visualize-block');
    tableroContainer.classList.toggle('hidden-block');
    tableroContainer.classList.toggle('visualize-block');

});

btnNiveles[2].addEventListener('click', function() {
    crearTablero(10, 10, 15);
    niveles.classList.toggle('hidden-block');
    niveles.classList.toggle('visualize-block');
    tableroContainer.classList.toggle('hidden-block');
    tableroContainer.classList.toggle('visualize-block');

});


function iniciarTemporizador() {
    if (temporizadorActivo) return;
    temporizadorActivo = true;
    tiempo = 0;
    temporizador.textContent = '000';
    intervaloTemporizador = setInterval(() => {
        tiempo++;
        temporizador.textContent = tiempo < 10 ? `00${tiempo}` : `${tiempo}`;
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
        juegoTerminado = true;
        document.querySelectorAll('.celda').forEach(btn => btn.disabled = true);
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


