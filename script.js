// Danh sách 3 màn chơi Sokoban
const levels = [
    // MÀN 1: Level em bé (Dễ)
    [
        "###########",
        "#### ######",
        "###  ###  #",
        "## $      #",
        "#   @$ #  #",
        "### $###  #",
        "###   #.. #",
        "###  ##.# #",
        "##      ###",
        "##     ####",
        "###########"
    ], // Dấu phẩy đã được thêm ở đây

    // MÀN 2: Mas Sasquatch - 1
    [
        "##########",
        "#   ######",
        "# $ $ $ ##",
        "### # # ##",
        "### #   ##",
        "### ### ##",
        "## .....@#",
        "## $ $   #",
        "## ### ###",
        "##     ###",
        "##########"
    ],

    // MÀN 3: Sasquatch IV - 3
    [
        "#########",
        "#####   #",
        "## @ $# #",
        "## #....#",
        "##$ $ $ #",
        "#  ### ##",
        "#      ##",
        "#####  ##",
        "#########"
    ]
];

let currentLevelIndex = 0;
let map = [];
let playerPos = { r: 0, c: 0 };
let moveHistory = [];

function playSFX(id) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// Tải màn chơi và căn lề lưới vuông vức
function loadLevel(levelIdx) {
    currentLevelIndex = levelIdx;
    const rawLevel = levels[levelIdx];

    // Lấy chiều rộng lớn nhất để không bị méo ô
    let maxCols = 0;
    rawLevel.forEach(row => {
        if (row.length > maxCols) maxCols = row.length;
    });

    // Tạo mảng 2 chiều
    map = rawLevel.map(row => {
        let arr = row.split('');
        while (arr.length < maxCols) arr.push(' ');
        return arr;
    });

    moveHistory = [];

    // Tìm tọa độ nhân vật
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === '@' || map[r][c] === '+') {
                playerPos = { r, c };
            }
        }
    }
    renderMap();
}

// Vẽ giao diện màn chơi lên DOM
function renderMap() {
    const board = document.getElementById('board');
    if (!board) return;
    board.innerHTML = '';

    const maxCols = map[0].length;
    board.style.gridTemplateColumns = `repeat(${maxCols}, 32px)`;

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < maxCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const char = map[r][c] || ' ';

            if (char === '#') {
                cell.classList.add('wall');
            } else if (char === '.') {
                cell.classList.add('target');
            } else if (char === '$') {
                cell.classList.add('box');
            } else if (char === '*') {
                cell.classList.add('box-on-target');
            } else if (char === '@') {
                cell.classList.add('player', 'floor');
            } else if (char === '+') {
                cell.classList.add('player-on-target');
            } else {
                cell.classList.add('floor');
            }

            board.appendChild(cell);
        }
    }
}

// Xử lý bước đi và đẩy thùng
function handleMove(dr, dc) {
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;

    if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[nr].length) return;

    const targetCell = map[nr][nc];
    if (targetCell === '#' || targetCell === undefined) return;

    const prevMapState = map.map(row => [...row]);
    const prevPlayerPos = { ...playerPos };

    // Di chuyển vào sàn/đích
    if (targetCell === ' ' || targetCell === '.') {
        map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
        playerPos = { r: nr, c: nc };
        map[nr][nc] = targetCell === '.' ? '+' : '@';

        moveHistory.push({ map: prevMapState, playerPos: prevPlayerPos });
        playSFX('sfx-step');
        renderMap();
        checkWin();
    }
    // Đẩy thùng
    else if (targetCell === '$' || targetCell === '*') {
        const boxNr = nr + dr;
        const boxNc = nc + dc;
        if (boxNr < 0 || boxNr >= map.length || boxNc < 0 || boxNc >= map[boxNr].length) return;

        const boxTargetCell = map[boxNr][boxNc];
        if (boxTargetCell === ' ' || boxTargetCell === '.') {
            map[boxNr][boxNc] = boxTargetCell === '.' ? '*' : '$';
            map[nr][nc] = targetCell === '*' ? '+' : '@';
            map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
            playerPos = { r: nr, c: nc };

            moveHistory.push({ map: prevMapState, playerPos: prevPlayerPos });
            playSFX('sfx-push');
            renderMap();
            checkWin();
        }
    }
}

// Hoàn tác bước đi
function undoMove() {
    if (moveHistory.length === 0) return;
    const lastState = moveHistory.pop();
    map = lastState.map;
    playerPos = lastState.playerPos;
    renderMap();
}

// Chơi lại màn hiện tại
function restartLevel() {
    loadLevel(currentLevelIndex);
}

// Đổi màn chơi từ menu chọn
function changeLevel(idx) {
    loadLevel(parseInt(idx, 10));
}

// Kiểm tra điều kiện thắng
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
        playSFX('sfx-win');
        setTimeout(() => {
            alert('🎉 Chúc mừng! Bạn đã hoàn thành màn chơi!');
            if (currentLevelIndex < levels.length - 1) {
                currentLevelIndex++;
                const select = document.getElementById('levelSelect');
                if (select) select.value = currentLevelIndex;
                loadLevel(currentLevelIndex);
            } else {
                alert('🏆 BẠN ĐÃ HOÀN THÀNH TOÀN BỘ CÁC MÀN CHƠI!');
            }
        }, 200);
    }
}

// Bắt sự kiện bàn phím
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleMove(-1, 0);
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleMove(1, 0);
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleMove(0, -1);
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleMove(0, 1);
});

window.onload = () => {
    loadLevel(0);
};
