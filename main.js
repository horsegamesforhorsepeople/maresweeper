function setSeed(seed) {
    !function(f,a,c){var s,l=256,p="random",d=c.pow(l,6),g=c.pow(2,52),y=2*g,h=l-1;function n(n,t,r){function e(){for(var n=u.g(6),t=d,r=0;n<g;)n=(n+r)*l,t*=l,r=u.g(1);for(;y<=n;)n/=2,t/=2,r>>>=1;return(n+r)/t}var o=[],i=j(function n(t,r){var e,o=[],i=typeof t;if(r&&"object"==i)for(e in t)try{o.push(n(t[e],r-1))}catch(n){}return o.length?o:"string"==i?t:t+"\0"}((t=1==t?{entropy:!0}:t||{}).entropy?[n,S(a)]:null==n?function(){try{var n;return s&&(n=s.randomBytes)?n=n(l):(n=new Uint8Array(l),(f.crypto||f.msCrypto).getRandomValues(n)),S(n)}catch(n){var t=f.navigator,r=t&&t.plugins;return[+new Date,f,r,f.screen,S(a)]}}():n,3),o),u=new m(o);return e.int32=function(){return 0|u.g(4)},e.quick=function(){return u.g(4)/4294967296},e.double=e,j(S(u.S),a),(t.pass||r||function(n,t,r,e){return e&&(e.S&&v(e,u),n.state=function(){return v(u,{})}),r?(c[p]=n,t):n})(e,i,"global"in t?t.global:this==c,t.state)}function m(n){var t,r=n.length,u=this,e=0,o=u.i=u.j=0,i=u.S=[];for(r||(n=[r++]);e<l;)i[e]=e++;for(e=0;e<l;e++)i[e]=i[o=h&o+n[e%r]+(t=i[e])],i[o]=t;(u.g=function(n){for(var t,r=0,e=u.i,o=u.j,i=u.S;n--;)t=i[e=h&e+1],r=r*l+i[h&(i[e]=i[o=h&o+t])+(i[o]=t)];return u.i=e,u.j=o,r})(l)}function v(n,t){return t.i=n.i,t.j=n.j,t.S=n.S.slice(),t}function j(n,t){for(var r,e=n+"",o=0;o<e.length;)t[h&o]=h&(r^=19*t[h&o])+e.charCodeAt(o++);return S(t)}function S(n){return String.fromCharCode.apply(0,n)}if(j(c.random(),a),"object"==typeof module&&module.exports){module.exports=n;try{s=require("crypto")}catch(n){}}else"function"==typeof define&&define.amd?define(function(){return n}):c["seed"+p]=n}("undefined"!=typeof self?self:this,[],Math);
    Math.seedrandom(seed);
}

class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(c1, c2) {
        return new Coordinate(c1.x + c2.x, c1.y + c2.y);
    }
}

// because js includes only works sometimes
function includes(arr, val) {
    for (let i = 0; i < arr.length; i++)
        if (JSON.stringify(val) == JSON.stringify(arr[i]))
            return true;
    return false;
}

function printBoard(board) {
    let print = "";
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++)
            print += board[y][x];
        print += "\n";
    }

    console.log(print);
}

function createMinesweeperBoard(xSize, ySize) {
    // initialize empty
    const board = [];
    for (let i = 0; i < ySize; i++) {
        board.push([]);
        for (let j = 0; j < xSize; j++) {
            board[i].push('.');
        }
    }

    const middleX = Math.floor(xSize / 2);
    const middleY = Math.floor(ySize / 2);
    const zeroes = [new Coordinate(middleX, middleY)];
    const dirs = [
        new Coordinate(1, 0),
        new Coordinate(-1, 0),
        new Coordinate(0, 1),
        new Coordinate(0, -1),
        new Coordinate(1, 1),
        new Coordinate(1, -1),
        new Coordinate(-1, 1),
        new Coordinate(-1, -1),
    ];

    // add safe space
    while (zeroes.length < 1.5 * Math.sqrt(ySize * xSize)) {
        let newPos;
        let valid = false;
        while (!valid) {
            const origin = zeroes[Math.floor(Math.random() * zeroes.length)];
            const dir = dirs[Math.floor(Math.random() * 4)];
            newPos = Coordinate.add(origin, dir);
            valid = !includes(zeroes, newPos);
        }
        zeroes.push(newPos);
    }

    for (let i = 0; i < zeroes.length; i++)
        board[zeroes[i].y][zeroes[i].x] = 0;

    // checks if neighbor is in zeroes
    function bordersOccupied(pos) {
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            if (includes(zeroes, Coordinate.add(pos, dir)))
                return true;
        }
        return false;
    }

    const mines = [];

    // adds mines
    for (let y = 0; y < ySize; y++) {
        for (let x = 0; x < xSize; x++) {
            const pos = new Coordinate(x, y);
            if (bordersOccupied(pos))
                continue;
            if (Math.floor(Math.random() * 4) == 0) {
                mines.push(pos);
                board[y][x] = 'X';
            }
        }
    }

    // adds numbers
    for (let y = 0; y < ySize; y++) {
        for (let x = 0; x < xSize; x++) {
            if (board[y][x] == 'X' || board[y][x] == 0)
                continue;
            let number = 0;
            for (let i = 0; i < dirs.length; i++) {
                const dir = dirs[i];
                const newPos = Coordinate.add(new Coordinate(x, y), dir);
                number += includes(mines, newPos);
            }
            board[y][x] = number;
        }
    }
    
    return board;
}

function createPlayerBoard(xSize, ySize) {
    const board = [];
    for (let y = 0; y < ySize; y++) {
        board.push([]);
        for (let x = 0; x < xSize; x++) {
            board[y][x] = '?';
        }
    }
    return board;
}

function updatePlayerBoard(player, board, clickPos, leftClick) {
    if (!leftClick) {
        if (player[clickPos.y][clickPos.x] == '?')
            player[clickPos.y][clickPos.x] = 'F';
        else if (player[clickPos.y][clickPos.x] == 'F')
            player[clickPos.y][clickPos.x] = '?';
        return player;
    }

    if (player[clickPos.y][clickPos.x] == 'F')
        return player;

    if (board[clickPos.y][clickPos.x] == 'X')
        return "ripbozo";

    const dirs = [
        new Coordinate(1, 0),
        new Coordinate(-1, 0),
        new Coordinate(0, 1),
        new Coordinate(0, -1),
        new Coordinate(1, 1),
        new Coordinate(1, -1),
        new Coordinate(-1, 1),
        new Coordinate(-1, -1),
    ];

    function isOoB(pos) {
        return pos.x < 0 || pos.y < 0 || pos.x > board[0].length - 1 || pos.y > board.length - 1;
    }

    if (board[clickPos.y][clickPos.x] != 0)
        player[clickPos.y][clickPos.x] = board[clickPos.y][clickPos.x];
    else {
        const visited = [];
        const queue = [clickPos];
        while (queue.length != 0) {
            const pos = queue.shift();
            visited.push(pos);
            player[pos.y][pos.x] = board[pos.y][pos.x];
            if (board[pos.y][pos.x] != 0)
                continue;

            for (let i = 0; i < dirs.length; i++) {
                const dir = dirs[i];
                const newPos = Coordinate.add(pos, dir);
                if (!includes(visited, newPos) && !includes(queue, newPos) && !isOoB(newPos) && player[newPos.y][newPos.x] != 'F') {
                    queue.push(newPos);
                }
            }

        }
    }

    return player;
}

function initGraphics(xSize, ySize) {
    const board = document.createElement("div");
    board.id = "board";
    for (let y = 0; y < ySize; y++) {
        for (let x = 0; x < xSize; x++) {
            const tile = document.createElement("div");
            tile.id = `${x} ${y}`;
            tile.className = "tile";
            board.append(tile);
        }
    }
    const timer = document.createElement("p");
    timer.id = "timer";
    timer.dataset.ison = "no";
    timer.innerText = "0";
    board.append(timer);
    document.body.append(board);
}

function updateGraphics(player) {
    const colors = {
        1:   "#52a0b7",
        2:   "#2eba37",
        3:   "#bf6228",
        4:   "#74237a",
        5:   "#244296",
        6:   "#52a0b7",
        7:   "#19632f",
        8:   "#968639",
        'F': "#990000"
    };
    for (let x = 0; x < player[0].length; x++) {
        for (let y = 0; y < player.length; y++) {
            const status = player[y][x];
            const tile = document.getElementById(`${x} ${y}`);
            if (status == '?') {
                tile.innerText = "";
                tile.classList = ["tile"];
                continue;
            }

            tile.classList.add("flipped");
            if (status != 0) {
                tile.innerText = status;
                tile.style.color = colors[status];
            }
        }
    }
}

function checkIfWon(player, board) {
    for (let y = 0; y < player.length; y++) {
        for (let x = 0; x < player[0].length; x++) {
            if (board[y][x] == 'X')
                continue;
            if (player[y][x] != board[y][x])
                return false;
        }
    }
    return true;
}

function dotimer() {
    document.getElementById("timer").innerText++;
}

function createShareButton(won, date, player = 0) {
    const yymmdd = `${date.getYear() + 1900}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const button = document.createElement("button");
    button.innerText = "share";
    button.id = "button";

    button.addEventListener("click", () => {
        const time = document.getElementById("timer").innerText;
        let text;
        if (won) {
            text = `i beat the daily maresweeper (${yymmdd}) in ${time} seconds`;
        } else {
            let correct = 0;
            for (let y = 0; y < player.length; y++) {
                for (let x = 0; x < player[0].length; x++) {
                    correct += !(player[y][x] == '?' || player[y][x] == 'F')
                }
            }
            const percentage = Math.round(correct / (player.length * player[0].length) * 100);
            text = `i beat ${percentage}% of the daily maresweeper (${yymmdd}) in ${time} seconds`;
        }
        navigator.clipboard.writeText(text);
    });

    button.style.pointerEvents = "auto";
    document.getElementById("board").append(button);
}

function main() {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    setSeed(date.getTime());
    const xSize = 31;
    const ySize = 15;
    const minesweeperBoard = createMinesweeperBoard(xSize, ySize);
    let playerBoard = createPlayerBoard(xSize, ySize);
    initGraphics(xSize, ySize);
    let timer;
    document.querySelectorAll(".tile").forEach((tile) => {
        tile.addEventListener("click", () => {
            if (document.getElementById("timer").dataset.ison == "no") {
                document.getElementById("timer").dataset.ison = "yes";
                timer = setInterval(dotimer, 1000);
            }
            const c = tile.id.split(" ");
            const pos = new Coordinate(parseInt(c[0]), parseInt(c[1]));
            let copy = [...playerBoard];
            playerBoard = updatePlayerBoard(playerBoard, minesweeperBoard, pos, true);
            if (checkIfWon(playerBoard, minesweeperBoard)) {
                clearInterval(timer);
                alert("yippee");
                document.getElementById("board").style.pointerEvents = "none";
                createShareButton(true, date);
            }
            if (playerBoard == "ripbozo") {
                clearInterval(timer);
                alert("you lost");
                createShareButton(false, date, copy);
                playerBoard = minesweeperBoard;
                document.getElementById("board").style.pointerEvents = "none";
            }
            updateGraphics(playerBoard);
            //printBoard(playerBoard);
        });

        tile.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            const c = tile.id.split(" ");
            const pos = new Coordinate(parseInt(c[0]), parseInt(c[1]));
            playerBoard = updatePlayerBoard(playerBoard, minesweeperBoard, pos, false);
            updateGraphics(playerBoard);
            //printBoard(playerBoard);
        });
    });

    //printBoard(minesweeperBoard);
    //printBoard(playerBoard);
}

main();
