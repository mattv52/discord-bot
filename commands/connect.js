module.exports = {
	name: 'connect',
  description: 'Initiates a game of Connect Four with an opponent',
  usage: '<opponent>',
  args: true,
  aliases: ['connect4', 'c4'],
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
      [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
      [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
      [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
      [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
      [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
      [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
      [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:']
    ]
    var fullColumns = [ ];

    // Setting up the inital game state and providing information
    message.channel.send("Enter a number 1-7 corresponding to which column you would like to place your token. \nPlayer one (the person who initiated the game) goes first.")
    printboard();
    playerOneTurn();

    // Function to print the board
    function printboard() {
      let board = '';
      for (row = 0; row <= 6; row++) {
        let tempRow = '';
        for (col = 0; col <= 6; col++) {
          tempRow += game[row][col] + ' ';
        }
        board += tempRow + '\n';
      }
      message.channel.send(board);
    }

    // Function for players ones turn
    function playerOneTurn() {
      // Waits for the first message from the player that is between 1 and 7
      const filter = m => (!isNaN(m.content) && m.content>0 && m.content<8 && m.author.id == player1.id && !fullColumns.includes(m.content)) || (m.content.toLowerCase() == 'game bot');
      const playerOneCollector = message.channel.createMessageCollector(filter, { max: 1 });
      
      // When a number is detected, 
      playerOneCollector.on('collect', m => {
        // If the 'number' was game bot, then it means player 1 gave up and concedes.
        if (m.content.toLowerCase() == 'game bot') { 
          message.channel.send("Congratulations Player 2, you win. Player 1 just gave up")
          return; 
        }

        // Setting which column is the users target, then iterate through it, starting at the bottom till an empty space.
        let target = parseInt(m.content) - 1;
        var tempRow;
        for (row = 5; row >= 0; row--) {
          // If its reached the last row in the column, add that column to the fullColumns array.
          if (row == 0) {
            fullColumns.push(target);
            console.log(m.content)
          }
          if (game[row][target] == ':white_circle:') {
            game[row][target] = ':red_circle:'
            tempRow = row;
            break;
          }
        }
        // Print the new board and check to see if it was a winning move.
        printboard()
        if (checkWin(tempRow, target, ':red_circle:')) {
          message.channel.send("Congratulations player one, you win. :)")
        } else {
          playerTwoTurn();
        }
      });
    }

    // Function for player twos turn
    function playerTwoTurn() {
      // Waits for the first message from the player that is between 1 and 7
      const filter = m => (!isNaN(m.content) && m.content>0 && m.content<8 && m.author.id == player2.id && !fullColumns.includes(m.content)) || (m.content.toLowerCase() == 'game bot');
      const playerTwoCollector = message.channel.createMessageCollector(filter, { max: 1 });
      
      // When a number is detected, 
      playerTwoCollector.on('collect', m => {
        // If the 'number' was game bot, then it means player 1 gave up and concedes.
        if (m.content.toLowerCase() == 'game bot') { 
          message.channel.send("Congratulations Player 1, you win. Player 2 just gave up")
          return; 
        }
        
        // Setting which column is the users target, then iterate through it, starting at the bottom till an empty space.
        let target = parseInt(m.content) - 1;
        var tempRow;
        for (row = 5; row >= 0; row--) {
          // If its reached the last row in the column, add that column to the fullColumns array.
          if (row == 0) {
            fullColumns.push(m.content);
          }
          if (game[row][target] == ':white_circle:') {
            game[row][target] = ':blue_circle:'
            tempRow = row;
            break;
          }
        }
        // Print the new board and check to see if there was a winning move
        printboard()
        if (checkWin(tempRow, target, ':blue_circle:')) {
          message.channel.send("Congratulations player two, you win. elyse is awesome:)")
        } else {
          playerOneTurn();
        }
      });
    }

    // Function for checking the win
    function checkWin(row, col, token) {
      if (vertWin(row, col, token) || horizWin(row, col, token) || leftDiagWin(row, col, token) || rightDiagWin(row, col, token)) {
        return true;
      }
    }

    // Function to check vertical win
    function vertWin(row, col, token) {
      let win = true;
      // If the column doesnt have atleast 4 tokens in it, it cant have a win.
      if (row>2) {
        win = false;
      } else {
        // Check the three tokens bellow. If any are not the same as it, then no win.
        for (var i = row; i < row+4; i++) {
          if (game[i][col] != token) {
            win = false;
            break;
          }
        }
      }
      return win;
    }

    // Function to check horizontal win
    function horizWin(row, col, token) {
      let win = true;
      let inARow = 1;
      // Check the tokens to the immediate left. Stop when a different token is found or hits an edge.
      for (var i = col-1; i >= 0; i--) {
        if (game[row][i] == token) {
          inARow++
        } else {
          break;
        }
      }
      // Check the tokens to the immediate right. Stop when a different token is found or hits an edge.
      for (var i = col+1; i <= 6; i++) {
        if (game[row][i] == token) {
          inARow++
        } else {
          break;
        }
      }
      // If there are at least 4 in a row, then theres a win :)
      if (inARow < 4) {
        win = false;
      }
      return win;
    }

    // Function to check the top left to bottom right diagnonal win
    function leftDiagWin(row, col, token) {
      let win = true;
      let inARow = 1;
      // Check the tokens to the top left. Stop when a different token is found or hits an edge.
      for (var i = 1; col-i >= 0 && row-1 >= 0; i++) {
        if (game[row-i][col-i] == token) {
          inARow++
        } else {
          break;
        }
      }
      // Check the tokens to the bottom right. Stop when a different token is found or hits an edge.
      for (var i = 1; col+i <= 6 && row+i <= 5; i++) {
        if (game[row+i][col+i] == token) {
          inARow++
        } else {
          break;
        }
      }
      // If theres at least 4 in a row then theres a win.
      if (inARow <4) {
        win = false;
      }
      return win;
    }

    // Function to check the top right to bottom left diagnonal win
    function rightDiagWin(row, col, token) {
      let win = true;
      let inARow = 1;
      // Check the tokens to the top right. Stop when a different token is found or hits an edge.
      for (var i = 1; col+i <= 6 && row-1 >= 0; i++) {
        if (game[row-i][col+i] == token) {
          inARow++
        } else {
          break;
        }
      }
      // Check the tokens to the bottom left. Stop when a different token is found or hits an edge.
      for (var i = 1; col-i >= 0 && row+i <= 5; i++) {
        if (game[row+i][col-i] == token) {
          inARow++
        } else {
          break;
        }
      }
      // If theres at least 4 in a row then theres a win.
      if (inARow <4) {
        win = false;
      }
      return win;
    }
  },
}