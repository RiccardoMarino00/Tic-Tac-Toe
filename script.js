// Aggiunge un listener per l'evento 'DOMContentLoaded' che esegue il codice una volta che il DOM è completamente caricato
window.addEventListener('DOMContentLoaded', () => {

    // Seleziona tutti gli elementi con la classe 'tile' e li converte in un array
    const tiles = Array.from(document.querySelectorAll('.tile'));
    // Seleziona l'elemento che mostra il giocatore corrente
    const playerDisplay = document.querySelector('.display-player');
    // Seleziona il pulsante di reset
    const resetButton = document.querySelector('#reset');
    // Seleziona l'elemento che annuncia il risultato del gioco
    const announcer = document.querySelector('.announcer');

    // Inizializza la board come un array di 9 elementi vuoti
    let board = ['', '', '', '', '', '', '', '', ''];
    // Inizializza il giocatore corrente a 'X'
    let currentPlayer = 'X';
    // Imposta lo stato del gioco come attivo
    let isGameActive = true;

    // Definisce costanti per i possibili risultati del gioco
    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYER0_WON';
    const TIE = 'TIE';

    /*
        Indici della board:
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

    // Definisce le condizioni di vittoria come array di array di indici
    const winningConditions = [
        [0, 1, 2], // Riga 1
        [0, 3, 6], // Colonna 1
        [0, 4, 8], // Diagonale principale
        [1, 4, 7], // Colonna 2
        [2, 5, 8], // Colonna 3
        [2, 4, 6], // Diagonale secondaria
        [3, 4, 5], // Riga 2
        [6, 7, 8], // Riga 3
    ];

    // Funzione per validare il risultato del gioco
    function handleResultValidation() {
        let roundWon = false; // Inizializza lo stato di vittoria del round a false
        for(let i = 0; i <= 7; i++) { // Itera su tutte le condizioni di vittoria
            const winCondition = winningConditions[i]; // Ottiene la condizione di vittoria corrente
            const a = board[winCondition[0]]; // Primo elemento della condizione di vittoria
            const b = board[winCondition[1]]; // Secondo elemento della condizione di vittoria
            const c = board[winCondition[2]]; // Terzo elemento della condizione di vittoria
            if (a === '' || b === '' || c === '') { // Se uno degli elementi è vuoto, continua al prossimo ciclo
                continue;
            }
            if (a === b && b === c) { // Se tutti e tre gli elementi sono uguali, c'è una vittoria
                roundWon = true;
                break; // Esce dal ciclo perché è stata trovata una vittoria
            }
        }

        if (roundWon) { // Se c'è stata una vittoria
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON); // Annuncia il vincitore
            isGameActive = false; // Imposta lo stato del gioco come inattivo
            return;
        }
        
        if (!board.includes('')) // Se la board non contiene elementi vuoti, c'è un pareggio
            announce(TIE); // Annuncia il pareggio
    };

    // Funzione per annunciare il risultato del gioco
    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = `Player <span class="playerO">O</span> Won`; // Annuncia che il giocatore O ha vinto
                break;
            case PLAYERX_WON:
                announcer.innerHTML = `Player <span class="playerX">X</span> Won`; // Annuncia che il giocatore X ha vinto
                break;
            case TIE:
                announcer.innerText = 'Tie'; // Annuncia il pareggio
        }
        announcer.classList.remove('hide'); // Mostra l'annunciatore
    };

    // Funzione per verificare se un'azione è valida
    const isValidAction = (tile) => {
        if(tile.innerText === 'X' || tile.innerText === 'O'){ // Se il tile è già stato selezionato
            return false; // L'azione non è valida
        }
        return true; // L'azione è valida
    };

    // Funzione per aggiornare la board
    const updateBoard = (index) => {
        board[index] = currentPlayer; // Imposta il valore del giocatore corrente nella board
    };

    // Funzione per cambiare giocatore
    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`); // Rimuove la classe del giocatore corrente
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Cambia il giocatore corrente
        playerDisplay.innerText = currentPlayer; // Aggiorna il display con il nuovo giocatore corrente
        playerDisplay.classList.add(`player${currentPlayer}`); // Aggiunge la classe del nuovo giocatore corrente
    };

    // Funzione che gestisce l'azione dell'utente
    const userAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive) { // Se l'azione è valida e il gioco è attivo
            tile.innerText = currentPlayer; // Imposta il testo del tile con il giocatore corrente
            tile.classList.add(`player${currentPlayer}`); // Aggiunge la classe del giocatore corrente al tile
            updateBoard(index); // Aggiorna la board
            handleResultValidation(); // Valida il risultato del gioco
            changePlayer(); // Cambia giocatore
        }
    };

    // Funzione per resettare la board
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', '']; // Resetta la board
        isGameActive = true; // Imposta il gioco come attivo
        announcer.classList.add('hide'); // Nasconde l'annunciatore

        if (currentPlayer === 'O') {
            changePlayer(); // Se il giocatore corrente è 'O', cambia a 'X'
        }

        tiles.forEach(tile => { // Resetta tutti i tile
            tile.innerText = ''; // Resetta il testo del tile
            tile.classList.remove('playerX'); // Rimuove la classe 'playerX' dal tile
            tile.classList.remove('playerO'); // Rimuove la classe 'playerO' dal tile
        });
    };

    // Aggiunge un listener per ogni tile
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index)); // Aggiunge l'evento click che esegue userAction
    });

    // Aggiunge un listener per il pulsante di reset
    resetButton.addEventListener('click', resetBoard); // Aggiunge l'evento click che esegue resetBoard
});