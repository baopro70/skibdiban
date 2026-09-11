// Bản đồ 3 màn chơi chuẩn xác theo hình ảnh
const levels = [
    // MÀN 1: Original - 1 (3 thùng)
    [
        "    #####",
        "  ###   #",
        "  # $   #",
        "### # $ #",
        "# $ # $ #",
        "### ### #",
        "  # . . #",
        "  #####@#",
        "      #.#",
        "      ###"
    ],

    // MÀN 2: Sasquatch IV - 3 (4 thùng)
    [
        "   #####",
        "   #   #",
        " ### $ #",
        " #  @..#",
        "## $.. #",
        "#  $ $ #",
        "#  #####",
        "####    "
    ],

    // MÀN 3: Mas Sasquatch - 1 (5 thùng)
    [
        "   ######",
        "   #    #",
        " ### $ $#",
        " #   $  #",
        "## $.....",
        "#  $ #####",
        "#   ##    ",
        "#####     "
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

function loadLevel(levelIdx) {
    currentLevelIndex = levelIdx;
    const levelData = levels[levelIdx];
    map = levelData.map(row => row.split(''));
    moveHistory = [];
    
    // Tìm vị trí người chơi
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === '@' || map[r][c] === '+') {
                playerPos = { r, c };
            }
        }
    }
    renderMap();
}

function renderMap() {
    const board = document.getElementById('board');
    if (!board) return;
    board.innerHTML = '';
    
    // Tìm chiều rộng lớn nhất của màn
    let maxCols = 0;
    map.forEach(row => { if (row.length > maxCols) maxCols = row.length; });
    
    board.style.gridTemplateColumns = `repeat(${maxCols}, 32px)`;
    
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < maxCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const char = map[r][c] || ' ';
            
            if (char === '#') cell.classList.add('wall');
            else if (char === '.') cell.classList.add('target');
            else if (char === '$') cell.classList.add('box');
            else if (char === '*') cell.classList.add('box-on-target');
            else if (char === '@') cell.classList.add('player', 'floor');
            else if (char === '+') cell.classList.add('player-on-target');
            else cell.classList.add('floor');
            
            board.appendChild(cell);
        }
    }
}

function handleMove(dr, dc) {
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    
    if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[nr].length) return;
    
    const targetCell = map[nr][nc];
    if (targetCell === '#' || targetCell === undefined) return;
    
    const prevMapState = map.map(row => [...row]);
    const prevPlayerPos = { ...playerPos };
    
    // 1. Di chuyển vào ô trống / ô đích
    if (targetCell === ' ' || targetCell === '.') {
        map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
        playerPos = { r: nr, c: nc };
        map[nr][nc] = targetCell === '.' ? '+' : '@';
        
        moveHistory.push({ map: prevMapState, playerPos: prevPlayerPos });
        playSFX('sfx-step');
        renderMap();
        checkWin();
    } 
    // 2. Đẩy thùng
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

function undoMove() {
    if (moveHistory.length === 0) return;
    const lastState = moveHistory.pop();
    map = lastState.map;
    playerPos = lastState.playerPos;
    renderMap();
}

function restartLevel() {
    loadLevel(currentLevelIndex);
}

function changeLevel(idx) {
    loadLevel(parseInt(idx, 10));
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleMove(-1, 0);
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleMove(1, 0);
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleMove(0, -1);
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleMove(0, 1);
});

window.onload = () => {
    loadLevel(0);
};
