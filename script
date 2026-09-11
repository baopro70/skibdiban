// Thiết lập bản đồ game Sokoban
// # : Tường | ' ' : Sàn | . : Đích | $ : Thùng | @ : Người chơi
const levelMap = [
    "  ##### ",
    "  #   # ",
    "  #$  # ",
    "###  $##",
    "#  $ $ #",
    "# # . # ",
    "#..@..# ",
    "####### "
];

let map = [];
let playerPos = { r: 0, c: 0 };

// Khởi tạo bàn chơi
function initGame() {
    map = levelMap.map(row => row.split(''));
    const board = document.getElementById('board');
    board.innerHTML = '';

    // Cấu hình số cột cho Grid CSS
    board.style.gridTemplateColumns = `repeat(${map[0].length}, 42px)`;

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

// Cập nhật lại giao diện người dùng
function renderMap() {
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
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

// Bắt sự kiện bàn phím máy tính
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') handleMove(0, -1);
    else if (e.key === 'ArrowDown') handleMove(0, 1);
    else if (e.key === 'ArrowLeft') handleMove(-1, 0);
    else if (e.key === 'ArrowRight') handleMove(1, 0);
});

// Xử lý di chuyển
function handleMove(dc, dr) {
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    const targetCell = map[nr][nc];

    // Di chuyển vào ô trống hoặc ô đích
    if (targetCell === ' ' || targetCell === '.') {
        map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
        playerPos = { r: nr, c: nc };
        map[nr][nc] = targetCell === '.' ? '+' : '@';
    }
    // Di chuyển đẩy thùng
    else if (targetCell === '$' || targetCell === '*') {
        const boxNr = nr + dr;
        const boxNc = nc + dc;
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

// Kiểm tra chiến thắng
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

// Chạy game khi tải trang
initGame();
