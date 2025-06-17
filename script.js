class Gomoku {
  constructor() {
    this.canvas = document.getElementById('chessboard');
    this.ctx = this.canvas.getContext('2d');
    this.size = 15;
    this.cellSize = 40;
    this.currentPlayer = 1; // 1:黑棋 -1:白棋
    this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
    this.gameOver = false;

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.canvas.width = this.size * this.cellSize;
    this.canvas.height = this.size * this.cellSize;
    this.drawBoard();
  }

  drawBoard() {
    // 绘制棋盘网格
    this.ctx.strokeStyle = '#333';
    for (let i = 0; i < this.size; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.cellSize + this.cellSize/2, this.cellSize/2);
      this.ctx.lineTo(i * this.cellSize + this.cellSize/2, this.canvas.height - this.cellSize/2);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.cellSize/2, i * this.cellSize + this.cellSize/2);
      this.ctx.lineTo(this.canvas.width - this.cellSize/2, i * this.cellSize + this.cellSize/2);
      this.ctx.stroke();
    }
  }

  bindEvents() {
    this.canvas.addEventListener('click', e => {
      if(this.gameOver) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const col = Math.round((x - this.cellSize/2) / this.cellSize);
      const row = Math.round((y - this.cellSize/2) / this.cellSize);
      
      if(this.isValidMove(row, col)) {
        this.placeChess(row, col);
        if(this.checkWin(row, col)) {
          this.gameOver = true;
          alert(`${this.currentPlayer === 1 ? '黑棋' : '白棋'}获胜！`);
        }
        this.currentPlayer *= -1;
        document.getElementById('current-player').textContent = 
          `当前玩家：${this.currentPlayer === 1 ? '黑棋' : '白棋'}`;
      }
    });

    document.getElementById('restart').addEventListener('click', () => {
      this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBoard();
      this.gameOver = false;
      this.currentPlayer = 1;
    });
  }

  isValidMove(row, col) {
    return row >= 0 && row < this.size && 
           col >= 0 && col < this.size &&
           this.board[row][col] === 0;
  }

  placeChess(row, col) {
    this.board[row][col] = this.currentPlayer;
    this.ctx.beginPath();
    this.ctx.arc(
      col * this.cellSize + this.cellSize/2,
      row * this.cellSize + this.cellSize/2,
      this.cellSize/2 - 2, 0, Math.PI * 2
    );
    this.ctx.fillStyle = this.currentPlayer === 1 ? '#000' : '#fff';
    this.ctx.fill();
    this.ctx.strokeStyle = '#666';
    this.ctx.stroke();
  }

  checkWin(row, col) {
    const directions = [
      [1, 0],  // 水平
      [0, 1],  // 垂直
      [1, 1],  // 正对角线
      [1, -1]  // 反对角线
    ];

    for (let [dx, dy] of directions) {
      let count = 1;
      for (let sign = -1; sign <= 1; sign += 2) {
        let x = row + dx * sign;
        let y = col + dy * sign;
        while (x >= 0 && x < this.size && 
               y >= 0 && y < this.size &&
               this.board[x][y] === this.currentPlayer) {
          count++;
          x += dx * sign;
          y += dy * sign;
        }
      }
      if (count >= 5) return true;
    }
    return false;
  }
}

// 初始化游戏
new Gomoku();