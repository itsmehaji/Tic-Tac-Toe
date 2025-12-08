document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const themeToggle = document.getElementById('themeToggle');
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let lastWinner = null; // Track the last winner

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Initialize game
    status.textContent = `Player ${currentPlayer}'s turn`;

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Add animation class
        clickedCell.style.animation = 'pop 0.3s ease-out';
        setTimeout(() => {
            clickedCell.style.animation = '';
        }, 300);
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningCombination;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const position1 = gameState[a];
            const position2 = gameState[b];
            const position3 = gameState[c];

            if (position1 === '' || position2 === '' || position3 === '') {
                continue;
            }

            if (position1 === position2 && position2 === position3) {
                roundWon = true;
                winningCombination = winningConditions[i];
                break;
            }
        }

        if (roundWon) {
            highlightWinningCombination(winningCombination);
            status.textContent = `Player ${currentPlayer} wins!`;
            lastWinner = currentPlayer; // Store the winner
            gameActive = false;
            return;
        }

        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            status.textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    function highlightWinningCombination(combination) {
        combination.forEach(index => {
            cells[index].style.backgroundColor = 'rgba(46, 213, 115, 0.3)';
            cells[index].style.transform = 'scale(1.1)';
        });
    }

    function handleRestartGame() {
        // Set the starting player based on who won the last game
        currentPlayer = lastWinner || 'X'; // If no winner yet (null), start with X
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
            cell.style.backgroundColor = '';
            cell.style.transform = '';
        });

        // Add restart animation
        document.querySelector('.game-board').style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.querySelector('.game-board').style.animation = '';
        }, 500);
    }

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    restartButton.addEventListener('click', handleRestartGame);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
});
