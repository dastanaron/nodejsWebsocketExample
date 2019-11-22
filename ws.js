
const WebSocket = require('ws');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

readline.question('What is your name?\r\n', (name) => {
	let socket = new WebSocket(`ws://localhost:5000?name=${name}`);

	socket.onopen = function(e) {
	  readline.on('line', (input) => {
		  if (input === '/exit') {
			  socket.close();
			  process.exit(1);
		  }
		  socket.send(input);
	  });
	};

	socket.onmessage = function(event) {
	  console.log(event.data);
	};

	socket.onclose = function(event) {
	  if (event.wasClean) {
		console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
		process.exit(1);
	  } else {
		// например, сервер убил процесс или сеть недоступна
		// обычно в этом случае event.code 1006
		console.log('[close] Соединение прервано');
	  }
	};

	socket.onerror = function(error) {
	  console.log(`[error] ${error.message}`, error);
	};
 });
