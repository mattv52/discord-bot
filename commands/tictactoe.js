module.exports = {
	name: 'tictactoe',
  description: 'Initiates a game of Tic Tac Toe with an opponent',
  usage: '<opponent>',
  args: true,
  aliases: ['ttt', 'xo'],
	execute(message, args) {
    // Checking to see if a player was actually called
    if (!(args[0].startsWith('<@') && args[0].endsWith('>'))) {
      message.channel.send(`Please enter mention a valid user, ${message.author}`);
      return;
    }

    // Setting player 1 and player 2
    const player1 = message.author;
    const player2 = global.getUserFromMention(args[0]); 

    // Setting game states
    let game = [
      [':one:', ':two:', ':three:'],
      [':four:', ':five:', ':six:'],
      [':seven:', ':eight:', ':nine:']
    ]
    var usedSpace = [ ];
    let moveCount = 0;

    // Setting up the inital game state and providing information
    message.channel.send("Enter a number 1-9 corresponding to where you would like to place your token. \nPlayer one (the person who initiated the game) goes first. \nJust type Game Bot when you give up to quit the game.")
    printboard();
    playerOneTurn();

    // Function to print the board
    function printboard() {
      let board = '';
      for (row = 0; row <= 2; row++) {
        let tempRow = '';
        for (col = 0; col <= 2; col++) {
          tempRow += game[row][col];
        }
        board += tempRow + '\n';
      }
      message.channel.send(board);
    }

    // Function for players ones turn
    function playerOneTurn() {
      // Waits for the first message from the player that is between 1 and 9
      const filter = m => (!isNaN(m.content) && m.content>0 && m.content<10 && m.author.id == player1.id && !usedSpace.includes(m.content)) || (m.content.toLowerCase() == 'game bot');
      const playerOneCollector = message.channel.createMessageCollector(filter, { max: 1 });
      
      // When a number (or game bot) is detected, run bellow
      playerOneCollector.on('collect', m => {
        // If game bot was entered, player 1 has given up and player 2 wins. End of game.
        if (m.content.toLowerCase() == 'game bot') { 
          message.channel.send("Congratulations Player 2, you win. Player 1 just gave up")
          return; 
        }
        // Adding the input to the usedSpace array so it cant be used again.
        usedSpace.push(Math.floor(m.content))
        // Converting the 1-9 input to a row and col of the game array
        let input = Math.floor(m.content)-1;
        let row = Math.floor((input)/3);
        let col = (input)%3;

        game[row][col] = ':o:'
        let gameState = checkWin(row, col, ':o:')

        if (gameState == 1) {
          printboard();
          message.channel.send("Congratulations Player 1, you win!!!");
        } else if (gameState == 2){
          printboard();
          message.channel.send("It's a draw!");
        } else {
          printboard()
          playerTwoTurn();
        }
      });
    }

    // Function for players twos turn
    function playerTwoTurn() {
      // Waits for the first message from the player that is between 1 and 9
      const filter = m => (!isNaN(m.content) && m.content>0 && m.content<10 && m.author.id == player2.id && !usedSpace.includes(m.content)) || (m.content.toLowerCase() == 'game bot');
      const playerTwoCollector = message.channel.createMessageCollector(filter, { max: 1 });
      
      // When a number (or game bot) is detected, run bellow
      playerTwoCollector.on('collect', m => {
        // If game bot was entered, player 2 has given up and player 1 wins. End of game.
        if (m.content.toLowerCase() == 'game bot') { 
          message.channel.send("Congratulations Player 1, you win. Player 2 just gave up")
          return; 
        }
        // Adding the input to the usedSpace array so it cant be used again.
        usedSpace.push(Math.floor(m.content))
        // Converting the 1-9 input to a row and col of the game array
        let input = Math.floor(m.content)-1;
        let row = Math.floor((input)/3);
        let col = (input)%3;

        game[row][col] = ':x:'
        let gameState = checkWin(row, col, ':x:')
        if (gameState == 1) {
          printboard();
          message.channel.send("Congratulations Player 2, you win!!!");
        } else if (gameState == 2){
          printboard();
          message.channel.send("It's a draw!");
        } else {
          printboard()
          playerOneTurn();
        }
      });
    }

    // Function to check for draw
    function checkDraw() {
      if (moveCount == 8) {
        return true;
      } else {
        moveCount++;
        return false;
      }
    }

    // Function to check the win. Returns 0 if no win, 1 if win and 2 if draw.
    function checkWin(row, col, target) {
      if (target == ':x:') {
        var winner = ':negative_squared_cross_mark:';
      } else {
        var winner = ':green_circle:';
      }
      let win = false;
      if (vertWin(col, target)) {
        for (i=0; i<3; i++) {
          game[i][col] = winner
        }
        win = true;
      }
      if (horizWin(row, target)) {
        for (i=0; i<3; i++) {
          game[row][i] = winner
        }
        win = true;
      }
      if (leftDiagWin(target)) {
        for (i=0; i<3; i++) {
          game[i][i] = winner
        }
        win = true;
      }
      if (rightDiagWin(target)) {
        for (i=0; i<3; i++) {
          game[2-i][i] = winner
        }
        win = true;
      }
      if (win) {
        return 1;
      } else if (checkDraw()) {
        return 2;
      } else {
        return 0;
      }
    }

    // Function to check vertical wins
    function vertWin(col, target) {
      let win = true;
      if (target == ':x:') {
        var winner = ':negative_squared_cross_mark:';
      } else {
        var winner = ':green_circle:';
      }
      for (var i=0; i<3; i++) {
        if (game[i][col] != target && game[i][col] != winner) {
          win = false;
        }
      }
      return win;
    }

    // Function to check horizontal wins
    function horizWin(row, target) {
      let win = true;
      if (target == ':x:') {
        var winner = ':negative_squared_cross_mark:';
      } else {
        var winner = ':green_circle:';
      }
      for (var i=0; i<3; i++) {
        if (game[row][i] != target && game[row][i] != winner) {
          win = false;
        }
      }
      return win;
    }

    // Function to check  left diagonal wins
    function leftDiagWin(target) {
      let win = true;
      if (target == ':x:') {
        var winner = ':negative_squared_cross_mark:';
      } else {
        var winner = ':green_circle:';
      }
      for (var i=0; i<3; i++) {
        if (game[i][i] != target && game[i][i] != winner) {
          win = false;
        }
      }
      return win;
    }

    // Function to check right diagonal wins
    function rightDiagWin(target) {
      let win = true;
      if (target == ':x:') {
        var winner = ':negative_squared_cross_mark:';
      } else {
        var winner = ':green_circle:';
      }
      for (var i=0; i<3; i++) {
        if (game[2-i][i] != target && game[2-i][i] != winner) {
          win = false;
        }
      }
      return win;
    }
  },
}