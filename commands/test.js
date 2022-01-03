module.exports = {
	name: 'test',
	description: 'Temporary command for testing',
	execute(message, args) {
		// for (var i=1; i<10; i++) {
		// 	message.channel.send((i-1)%3)
		// }
		// for(var i=1; i>0; i++) {
		// 	message.channel.send(i);
		// }
		// var x = 0;
		// message.channel.send(x);
		// function test1() {
		// 	x+= 1;
		// 	if(x<10) { test2(); }
		// 	message.channel.send(x);
		// }
		// function test2() {
		// 	x+=1;
		// 	test1();
		// 	message.channel.send(x);
		// }
		// test1();
		let game = [
			[':white_circle:', ':white_circle:', ':white_circle:'],
			[':white_circle:', ':white_circle:', ':white_circle:'],
			[':white_circle:', ':white_circle:', ':six:']
		]
		let game3 = game;
		message.channel.send(game3[2][2])
		// let game = [
		// 	[0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0]
		// ]
    // function printboard() {
    //   let board = '';
    //   for (row = 0; row <= 2; row++) {
    //     let tempRow = '';
    //     for (col = 0; col <= 2; col++) {
    //       tempRow += game[row][col];
    //     }
    //     board += tempRow + '\n';
    //   }
    //   message.channel.send(board);
		// }
		// printboard();
		// game[1][2] = ':red_circle:';
		// console.log(game);
		// game[0][0] = ':red_circle:';
		// message.channel.send(game[0][0]);
		// console.log(global.getUserFromMention(args[0]).id);
		// console.log(getUserFromMention(args[0]));
		// console.log(message.author);
		// console.log(message.mentions.users);
		// function test1() {
		// 	message.channel.send("test");
		// }
	},

};

