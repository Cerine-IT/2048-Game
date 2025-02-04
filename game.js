document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const scoreDisplay = document.getElementById("score");
    const retryBtn = document.getElementById("retryBtn");
    const winMessage = document.getElementById("winMessage");
    const loseMessage = document.getElementById("loseMessage");
    const pauseBtn = document.getElementById("pauseBtn");
    const timerDisplay = document.getElementById("timer");
    const moveSound = document.getElementById("moveSound");


    let score = 0;
    let board = Array(4).fill().map(() => Array(4).fill(0));
    let gamePaused = false;
    let startTime = null;
    let timerInterval;

    function playSound() {
        moveSound.currentTime = 0;
        moveSound.play().catch(error => console.log("Erreur audio:", error));
    }

    function startTimer() {
        if (!startTime) {
            startTime = Date.now();
            timerInterval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const minutes = Math.floor(elapsedTime / 60000);
                const seconds = Math.floor((elapsedTime % 60000) / 1000);
                timerDisplay.innerText = `${pad(minutes)}:${pad(seconds)}`;
            }, 1000);
        }
    }

    function pad(num) {
        return num < 10 ? '0' + num : num;
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function createBoard() {
        grid.innerHTML = "";
        board.forEach(row => {
            row.forEach(value => {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                tile.innerText = value !== 0 ? value : "";
                tile.style.backgroundColor = getColor(value);
                grid.appendChild(tile);
            });
        });
    }

    function getColor(value) {
        const colors = {
            2: "#FAEBD7", 4: "#FFDAB9", 8: "#FFA07A", 16: "#FF7F50",
            32: "#FF4500", 64: "#FF6347", 128: "#FFD700", 256: "#DAA520",
            512: "#B8860B", 1024: "#CD5C5C", 2048: "#8B0000"
        };
        return colors[value] || "#ccc";
    }

    function addRandomTile() {
        let emptyTiles = [];
        board.forEach((row, r) => {
            row.forEach((value, c) => {
                if (value === 0) emptyTiles.push({ r, c });
            });
        });
        if (emptyTiles.length > 0) {
            let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;

        setTimeout(() => {
            grid.children[r * 4 + c].classList.add("new-tile");
        }, 10);
        }
    }

    function slide(row) {
        let oldRow = [...row];
        let newRow = row.filter(v => v);
        while (newRow.length < 4) newRow.push(0);

        if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) {
            playSound();
        }
        return newRow;
    }

    function combine(row) {
        for (let i = 0; i < 3; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                row[i + 1] = 0;
                score += row[i];
                playSound();
            }
        }
        return slide(row);
    }

    function moveLeft() {
        board = board.map(row => combine(slide(row)));
        addRandomTile();
        createBoard();
    }

    function moveRight() {
        board = board.map(row => combine(slide(row.reverse())).reverse());
        addRandomTile();
        createBoard();
    }

    function moveUp() {
        board = transpose(board);
        board = board.map(row => combine(slide(row)));
        board = transpose(board);
        addRandomTile();
        createBoard();
}

    function moveDown() {
        board = transpose(board);
        board = board.map(row => combine(slide(row.reverse())).reverse());
        board = transpose(board);
        addRandomTile();
        createBoard();
    }

    function transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function checkGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return;
            if (c < 3 && board[r][c] === board[r][c + 1]) return;
            if (r < 3 && board[r][c] === board[r + 1][c]) return;
        }
    }
    loseMessage.style.display = "block";
    retryBtn.style.display = "block";
    stopTimer();
}

    function checkWin() {
        if (board.flat().includes(128)) {
            winMessage.style.display = "block";
        }
    }

    function togglePause() {
        gamePaused = !gamePaused;
        if (gamePaused) {
            pauseBtn.innerText = "▶️";
            stopTimer();
        } else {
            pauseBtn.innerText = "⏸";
            startTimer();
        }
    }

    document.addEventListener("keydown", (event) => {
        if (gamePaused) return;

        switch (event.key) {
            case "ArrowLeft": moveLeft(); break;
            case "ArrowRight": moveRight(); break;
            case "ArrowUp": moveUp(); break;
            case "ArrowDown": moveDown(); break;
        }
        createBoard();
        scoreDisplay.innerText = score;
        checkWin();
        checkGameOver();
    });

    pauseBtn.addEventListener("click", togglePause);

    retryBtn.addEventListener("click", () => {
        board = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        scoreDisplay.innerText = score;
        winMessage.style.display = "none";
        loseMessage.style.display = "none";
        retryBtn.style.display = "none";
        startTime = null;
        timerDisplay.innerText = "00:00";
        gamePaused = false;
        pauseBtn.innerText = "⏸";

        addRandomTile();
        addRandomTile();
        createBoard();
        startTimer();
    });

    
    document.querySelector(".up").addEventListener("click", () => {
        moveUp();
        updateGame();
    });

    document.querySelector(".down").addEventListener("click", () => {
        moveDown();
        updateGame();
    });

    document.querySelector(".left").addEventListener("click", () => {
        moveLeft();
        updateGame();
    });

    document.querySelector(".right").addEventListener("click", () => {
        moveRight();
        updateGame();
    });

    
    addRandomTile();
    addRandomTile();
    createBoard();
    startTimer();

    function updateGame() {
        createBoard();
        scoreDisplay.innerText = score;
        checkWin();
        checkGameOver();
    }
});

function createStars() {
    const starCount = 50; 
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        
        star.style.left = `${Math.random() * 100}vw`; 
        star.style.top = `${Math.random() * 100}vh`; 
        star.style.animationDelay = `${Math.random() * 3}s`; 
        document.body.appendChild(star);
    }
}
createStars();

    document.getElementById("homeBtn").addEventListener("click", ()=> {
        window.location.href = "index.html";
    });
