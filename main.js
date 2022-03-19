console.log('JavaScript Beginner Projects: Tic Tac Toe!'); // hiển thị trên cửa sổ log

// thêm sự kiện cho các đối tượng html
window.addEventListener('DOMContentLoaded', () => {
  _Setup();
});

const BOARD_STATE = {
  player: 1,
  ai: 2,
  blank: 3,
  draw: 4,
};

let _GAMESTATE = null; // biến thể hiện trảng thái của trò chơi

// hàm Setup tạo bảng và bắt đầu trò chơi
// bảng gồm có 3 cột và 3 dòng
function _Setup() {
  _CreateBoard(); // khởi tạo bảng
  _InitializeState(); // khởi tạo trạng thái
}

// Hàm tạo bảng
function _CreateBoard() {
  const rows = document.getElementById('rows');
  // tạo 3 thẻ div có chức năng giống như container cho dòng
  for (let x = 0; x < 3; x++) {
    // tạo một node với tên node là div
    const curRow = document.createElement('div');
    curRow.id = 'row' + x; // thêm id cho mỗi dòng
    curRow.className = 'row'; // đặt tên cho class là row
    rows.appendChild(curRow); // gắn node vừa được tạo vào trang

    // thêm các ô vào từng vùng đã tạo bên trên
    // thêm vùng đã tạo vào file index.html
    for (let y = 0; y < 3; y++) {
      // tạo một node với tên node là img
      const node = document.createElement('img');
      node.className = 'square'; // đặt tên cho class là square
      node.id = x + '.' + y; // thêm id cho mỗi node
      node.onclick = _HandlePlayerClick; // thêm sự kiện onclick cho noe
      curRow.appendChild(node); // gắn node vừa được tạo vào trang
    }
  }
}

// Hàm khởi tạo trạng thái
function _InitializeState() {
  // quy định lượt đầu tiên là người chơi
  _GAMESTATE = {
    turn: 'player',
    active: true,
  };
}

// xử lý sự kiện khi người chơi click vào một ô
function _HandlePlayerClick(evt) {
  // tạo biến kiểm tra xem ô đó có trống hay không
  const isBlank = !evt.target.src.length;
  // nếu ô đó trống và trạng thái trò chơi đã bắt đầu và lượi chơi là người chơi
  if (isBlank &&
      _GAMESTATE.active &&
      _GAMESTATE.turn == 'player') {
    evt.target.src = 'x.png'; // thêm dấu x vào ô vừa click
    _CheckGameOver(); // kiểm tra xem game đã kết thúc hay không
    _AISelectMove(); // AI sẽ tiến hành lựa chọn nước đi tiếp theo
  }
}

// Khởi tạo hàm kiểm tra trò chơi có thể kết thúc
function _CheckGameOver() {
  // tạo biến lưu người thắng
  const winner = _EvaluateBoard(_GetBoardStates());
  // nếu không tìm được người chiến thắng, ta return
  if (winner == null) {
    return;
  }

  // khi đă tìm được người chiến thắng, ta vô hiệu hóa bảng
  _GAMESTATE.active = false;

  // tạo biến thông báo
  let desc = '';

  // nếu người chiến thắng là ai ta hiện thị thông báo bạn đã thua
  if (winner == BOARD_STATE.ai) {
    desc = 'Bạn đã thua!';
  } else if (winner == BOARD_STATE.player) {
    desc = 'Bạn đã thắng!'; // nếu người chiến thắng là người chơi, ta hiển thị thông báo bạn thắng
  } else {
    desc = 'Hòa nhau, xin hãy thử lại' // nếu không ai thắng thì hòa nhau
  }

  // tìm phần tử có id là description và gán text bên trong nó là biến desc
  document.getElementById('description').innerText = desc;
}

// Khởi tạo hàm lấy trạng thái của bảng
function _GetBoardStates() {
  // tạo mảng thể hiện trạng thái của bảng
  const boardStates = [];
  // khởi tạo vòng lặp tương đương với 3 dòng trên bảng
  for (let x = 0; x < 3; x++) {
    // tạo mảng dòng
    const row = [];
    // khởi tạo vòng lặp tương đương với 3 ô trên mỗi dòng
    for (let y = 0; y < 3; y++) {
      // tạo biến node sẽ lấy các phần tử có id x.y
      const node = document.getElementById(x + '.' + y);
      // nếu node chứa dấu X (hình ảnh x.png)
      if (node.src.includes('x.png')) {
        row.push(BOARD_STATE.player); // thêm trạng thái của bảng là người chơi vào mảng
      } else if (node.src.includes('o.png')) { // nếu node chứa dấu O (hình ảnh o.png)
        row.push(BOARD_STATE.ai); // thêm trạng thái của bảng là ai vào mảng
      } else {
        row.push(BOARD_STATE.blank); // thêm trạng thái của bảng là rỗng vào mảng
      }
    }
    boardStates.push(row); // thêm mảng row vào mảng boardStates
  }
  return boardStates; // trả về mảng broardStates
}

// Khởi tạo hàm lấy id của các phần tử node là hình vuông
function _GetSquareElementNodes() {
  // Khởi tạo mảng nodes
  const nodes = [];
  // tạo vòng lặp
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      // tìm các phần tử có id là x.y và thêm các phần tử đó vào mảng nodes
      nodes.push(document.getElementById(x + '.' + y)) 
    }
  }
  return nodes; // trả về mảng nodes
}

// Khởi tạo hàm AI lựa chọn nước đi
function _AISelectMove(blinks) {
  _GAMESTATE.turn = 'ai'; // lượt chơi là của AI
  // tạo mảng boardStates lưu giá trị trả về của hàm _GetBoardStates
  const boardStates = _GetBoardStates(); 
  const [_, choice] = _Minimax(boardStates, BOARD_STATE.ai);

  // nếu lựa chọn khác null
  if (choice != null) {
    const [x, y] = choice; // tạo biến x, y lưu giá trị của lựa chọn
    // ai sẽ đánh dâu O vào vị trí của ô x.y
    document.getElementById(x + '.' + y).src = 'o.png'; 
  }

  _CheckGameOver(); // kiểm tra xem trò chơi đã kết thúc hay chưa

  _GAMESTATE.turn = 'player'; // trả lượt chơi về cho người chơi
}

// Khởi tạo hàm đánh giá bảng
// biến truyền vào là trạng thái của bảng
function _EvaluateBoard(boardStates) {
  // tạo biến lưu chuỗi thắng
  const winningStates = [
    // Ăn ngang và dọc
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],

    // Ăn chéo
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]],
  ];

  for (const possibleState of winningStates) {
    let curPlayer = null;
    let isWinner = true;
    for (const [x, y] of possibleState) {
      const occupant = boardStates[x][y];
      if (curPlayer == null && occupant != BOARD_STATE.blank) {
        curPlayer = occupant;
      } else if (curPlayer != occupant) {
        isWinner = false;
      }
    }
    if (isWinner) {
      return curPlayer;
    }
  }

  let hasMoves = false;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (boardStates[x][y] == BOARD_STATE.blank) {
        hasMoves = true;
      }
    }
  }
  if (!hasMoves) {
    return BOARD_STATE.draw;
  }

  return null;
}

function _Minimax(boardStates, player) {
  // Kiểm tra xem trò chơi đã kếu thúc hay chưa
  const winner = _EvaluateBoard(boardStates);
  if (winner == BOARD_STATE.ai) {
    return [1, null];
  } else if (winner == BOARD_STATE.player) {
    return [-1, null];
  }

  let move, moveScore; // tạo biến move, moveScore
  // Nếu người chơi là Ai thì Ai sẽ là Maximize
  if (player == BOARD_STATE.ai) {
    [moveScore, move] = _Minimax_Maximize(boardStates);
  } else {
    // nếu không phải là Ai thì sẽ là Minimize
    [moveScore, move] = _Minimax_Minimize(boardStates);
  }

  if (move == null) {
    moveScore = 0;
  }

  // Nếu không có bước di chuyển tiếp theo thì sẽ hòa
  return [moveScore, move];
}

function _Minimax_Maximize(boardStates) {
  // tạo một biến là số âm vô cực
  let moveScore = Number.NEGATIVE_INFINITY;
  let move = null; // tạo biến move là null

  // Khởi tạo vòng lặp kiểm tra tất cả các ô trên bàn cờ
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      // kiểm tra xem nếu ô thuộc dòng x cột y là rỗng
      if (boardStates[x][y] == BOARD_STATE.blank) {
        const newBoardStates = boardStates.map(r => r.slice());
        
        // ta sẽ tiến hành giả sử xem nếu Ai đi vào ô đó
        newBoardStates[x][y] = BOARD_STATE.ai;

        // ta sẽ gọi hàm Minimax nhưng lần này tham số truyền vào sẽ là người chơi
        // giả sử người chơi sẽ đi vào ô đó
        const [newMoveScore, _] =  _Minimax(
            newBoardStates, BOARD_STATE.player);
        
        // kiểm tra xem nếu điểm đi của người chơi lớn hơn điểm đi mà Ai đã chọn
        if (newMoveScore > moveScore) {
          move = [x, y]; // vị trí chọn là ô thuộc dòng x cột y
          moveScore = newMoveScore; // gán điểm di chuyển của người chơi vào điểm di chuyển của Ai
        }
      }
    }
  }

  return [moveScore, move]; // trả về vị trí ô sẽ chọn và điểm nhận được khi chọn ô đó
}

function _Minimax_Minimize(boardStates) {
  let moveScore = Number.POSITIVE_INFINITY;
  let move = null;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (boardStates[x][y] == BOARD_STATE.blank) {
        const newBoardStates = boardStates.map(r => r.slice());

        newBoardStates[x][y] = BOARD_STATE.player;

        const [newMoveScore, _] =  _Minimax(
            newBoardStates, BOARD_STATE.ai);

        if (newMoveScore < moveScore) {
          move = [x, y];
          moveScore = newMoveScore;
        }
      }
    }
  }

  return [moveScore, move];
}

/*
function _Minimax2(boardStates, aiTurn) {
  // First check if the game has already been won.
  const winner = _EvaluateBoard(boardStates);
  if (winner == BOARD_STATE.ai) {
    return [1, null];
  } else if (winner == BOARD_STATE.player) {
    return [-1, null];
  }

  let moveCost = Number.NEGATIVE_INFINITY;
  if (!aiTurn) {
    moveCost = Number.POSITIVE_INFINITY;
  }
  let move = null;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (boardStates[x][y] == BOARD_STATE.blank) {
        const newBoardStates = boardStates.map(r => r.slice());

        if (aiTurn) {
          newBoardStates[x][y] = BOARD_STATE.ai;
        } else {
          newBoardStates[x][y] = BOARD_STATE.player;
        }

        const [newMoveCost, _] =  _Minimax(newBoardStates, !aiTurn);

        if (aiTurn) {
          if (newMoveCost > moveCost) {
            move = [x, y];
            moveCost = newMoveCost;
          }
        } else {
          if (newMoveCost < moveCost) {
            move = [x, y];
            moveCost = newMoveCost;
          }
        }
      }
    }
  }

  if (move != null) {
    return [moveCost, move];
  }

  // No move, so it's a draw
  return [0, null];
}
*/