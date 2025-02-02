document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const scoreDisplay = document.getElementById("score");
    const retryBtn = document.getElementById("retryBtn");
    const winMessage = document.getElementById("winMessage");
    const loseMessage = document.getElementById("loseMessage");
    
    let score = 0;
    let board = Array(4).fill().map(() => Array(4).fill(0));

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
        }
    }

    function slide(row) {
        let newRow = row.filter(v => v);
        while (newRow.length < 4) newRow.push(0);
        return newRow;
    }

    function combine(row) {
        for (let i = 0; i < 3; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                row[i + 1] = 0;
                score += row[i];
            }
        }
        return slide(row);
    }

    function moveLeft() {
        board = board.map(row => combine(slide(row)));
    }

    function moveRight() {
        board = board.map(row => combine(slide(row.reverse())).reverse());
    }

    function moveUp() {
        board = transpose(board);
        moveLeft();
        board = transpose(board);
    }

    function moveDown() {
        board = transpose(board);
        moveRight();
        board = transpose(board);
    }

    function transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function checkGameOver() {
        if (!board.flat().includes(0)) {
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 3; c++) {
                    if (board[r][c] === board[r][c + 1] || board[c][r] === board[c + 1][r]) {
                        return;
                    }
                }
            }
            loseMessage.style.display = "block";
        }
    }

    function checkWin() {
        if (board.flat().includes(2048)) {
            winMessage.style.display = "block";
        }
    }

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowLeft": moveLeft(); break;
            case "ArrowRight": moveRight(); break;
            case "ArrowUp": moveUp(); break;
            case "ArrowDown": moveDown(); break;
        }
        addRandomTile();
        createBoard();
        scoreDisplay.innerText = score;
        checkWin();
        checkGameOver();
    });

    retryBtn.addEventListener("click", () => {
        board = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        scoreDisplay.innerText = score;
        winMessage.style.display = "none";
        loseMessage.style.display = "none";
        addRandomTile();
        addRandomTile();
        createBoard();
    });

    addRandomTile();
    addRandomTile();
    createBoard();
});
