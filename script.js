// Các màn chơi
const levels = [
    // Màn 1: Dễ (2 thùng)
    [
        "  ##### ",
        "###   # ",
        "# . $ # ",
        "# # $ # ",
        "# . @ # ",
        "####### "
    ],
    // Màn 2: Vừa (3 thùng)
    [
        "######  ",
        "#    #  ",
        "# #$ #  ",
        "# $ .#  ",
        "##$#.   ",
        " # @.   ",
        " ####   "
    ],
    // Màn 3: Thử thách (4 thùng)
    [
        "  ####  ",
        "###  #  ",
        "#    #  ",
        "# $ $#  ",
        "###$ #  ",
        "#.#@ ###",
        "#..$   #",
        "#####..#",
        "    ####"
    ]
];

let currentLevelIndex = 0;
let map = [];
let playerPos = { r: 0, c: 0 };

// Hàm phát âm thanh
function playSFX(id) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0; // Đặt lại âm thanh về đầu
        sound.play().catch(() => {}); // Tránh lỗi trình duyệt chặn autostart
    }
}

function initGame() {
    const currentLevelMap = levels[currentLevelIndex];
    map = currentLevelMap.map(row => row.split(''));
    
    const board = document.getElementById('board');
    if (!board) return;
    
    board.innerHTML = '';
    
    let maxCols = 0;
    map.forEach(row => { if (row.length > maxCols) maxCols = row.length; });
    
    board.style.gridTemplateColumns = `repeat(${maxCols}, 42px)`;

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < maxCols; c++) {
            const tile = document.createElement('div');
            tile.id = `tile-${r}-${c}`;
            tile.classList.add('tile');

            const char = map[r][c] || ' ';
            if (char === '@' || char === '+') {
                playerPos = { r, c };
            }

            board.appendChild(tile);
        }
    }
    renderMap();
}

function renderMap() {
    let maxCols = 0;
    map.forEach(row => { if (row.length > maxCols) maxCols = row.length; });

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < maxCols; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            if (!tile) continue;
            
            tile.className = 'tile';
            const char = map[r][c] || ' ';

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

// Bắt sự kiện phím
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

    // 1. Di chuyển vào ô trống
    if (targetCell === ' ' || targetCell === '.') {
        map[playerPos.r][playerPos.c] = map[playerPos.r][playerPos.c] === '+' ? '.' : ' ';
        playerPos = { r: nr, c: nc };
        map[nr][nc] = targetCell === '.' ? '+' : '@';
        playSFX('sfx-step'); // Phát tiếng bước chân
    }
    // 2. Đẩy thùng
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
            playSFX('sfx-push'); // Phát tiếng đẩy thùng
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
        playSFX('sfx-win'); // Phát tiếng thắng màn
        setTimeout(() => {
            if (currentLevelIndex < levels.length - 1) {
                alert(`🎉 Xuất sắc! Bạn đã vượt qua Màn ${currentLevelIndex + 1}! Chuẩn bị sang Màn ${currentLevelIndex + 2}.`);
                currentLevelIndex++;
                
                const select = document.getElementById('levelSelect');
                if (select) select.value = currentLevelIndex;
                
                initGame();
            } else {
                alert("🏆 BẠN ĐÃ HOÀN THÀNH TOÀN BỘ GAME SOKOBAN! CỰC KỲ XUẤT SẮC!");
            }
        }, 200);
    }
}

function changeLevel(index) {
    currentLevelIndex = parseInt(index);
    initGame();
}

function resetLevel() {
    initGame();
}

window.onload = function() {
    initGame();
};
