// Bản đồ dạng hình chữ nhật chuẩn (8 cột x 8 hàng)
const levelMap = [
    "#####   ",
    "#   #   ",
    "#$  #   ",
    "### $## ",
    "#  $ $ #",
    "# # . # ",
    "#..@..# ",
    "####### "
];

let map = [];
let playerPos = { r: 0, c: 0 };

function initGame() {
    map = levelMap.map(row => row.split(''));
    const board = document.getElementById('board');
    if (!board) return;
    
    board.innerHTML = '';
    
    // Cố định kích thước số cột theo bản đồ
    const cols = map[0].length;
    board.style.gridTemplateColumns = `repeat(${cols}, 42px)`;

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const tile = document.createElement('div');
            tile.id = `tile-${r}-${c}`;
            tile.classList.add('tile');

            if (map[r][c] === '@') playerPos = { r, c };

            board.appendChild(tile);
        }
    }
    renderMap();
}

function renderMap() {
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            if (!tile) continue;
            
            tile.className = 'tile';

            const char = map[r][c];
            if (char === '#') tile.classList.add('wall');
            else if (char === ' ') tile.classList.add('floor');
            else if (char === '.') tile.classList.add('goal');
            else if (char === '$') tile.classList.add('box');
            else if (char === '*') tile.classList.add('box-on-goal');
            else if (char === '@') tile.classList.add('player', 'floor');
            else if (char === '+') tile.classList.add('player', 'goal');
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') handleMove(0, -1);
    else if (e.key === 'ArrowDown') handleMove(0, 1);
    else if (e.key === 'ArrowLeft') handleMove(-1, 0);
    else if (e.key === 'ArrowRight') handleMove(1, 0);
});

function handleMove(dc, dr) {
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    
    if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[0].length) return;
    
    const targetCell = map[nr][nc];

    if (targetCell === ' ' || targetCell === '.') {
        map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
        playerPos = { r: nr, c: nc };
        map[nr][nc] = targetCell === '.' ? '+' : '@';
    }
    else if (targetCell === '$' || targetCell === '*') {
        const boxNr = nr + dr;
        const boxNc = nc + dc;
        
        if (boxNr < 0 || boxNr >= map.length || boxNc < 0 || boxNc >= map[0].length) return;
        
        const boxTargetCell = map[boxNr][boxNc];

        if (boxTargetCell === ' ' || boxTargetCell === '.') {
            map[boxNr][boxNc] = boxTargetCell === '.' ? '*' : '$';
            map[nr][nc] = targetCell === '*' ? '+' : '@';
            map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
            playerPos = { r: nr, c: nc };
        }
    }

    renderMap();
    checkWin();
}

function checkWin() {
    let hasWon = true;
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === '$') {
                hasWon = false;
                break;
            }
        }
    }
    if (hasWon) {
        setTimeout(() => alert("🎉 Xuất sắc! Bạn đã hoàn thành bài tập Tin học!"), 150);
    }
}

function resetLevel() {
    initGame();
}

// Chạy game khi trang load xong
window.onload = function() {
    initGame();
};
