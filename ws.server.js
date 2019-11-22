
const WebSocket = require('ws');
const Url = require('url');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
const clients = [];

const wss = new WebSocket.Server({ port: 5000 });
let connectionIDCounter = 0
wss.on('connection', (ws, params) => {
	let inputParameters = new URLSearchParams(Url.parse(params.url).query);
	let clientName = inputParameters.get('name');
	let id = ++connectionIDCounter;
	if (findClientByName(clientName) !== undefined || clientName === 'SERVER' || clientName === 'server') {
		ws.close(1000, 'Такой логин уже зарезервирован');
		return;
	} else if (!clientName) {
		ws.close(1000, 'Нельзя с пустым логином');
		return;
	}

	clients.push({
		name: clientName,
		ws: ws,
		id: id,
	});


  ws.on('message', message => {
    if (message == '/show participants') {
		let participants = [];
		for (let client of clients) {
			participants.push(client.name);
		}
		ws.send(participants.join(', '));
		return;
	}
	wss.sendAll(clientName, message);
  })
  ws.send('Соединение установлено')
})

readline.on('line', (input) => {
	if (input === '/show clients') {
		for (let client of clients) {
			console.log(`id: ${client.id} name: ${client.name}`);
		}
		return;
	}
	else if (input === '/close') {
		wss.closeAll();
		return;
	}
	wss.sendAll(`SERVER`, `| ${input} |`);
});

wss.sendAll = (from, message) => {
	for (let client of clients) {
		client.ws.send(`${from}: ${message}`);
	}
};

wss.closeAll = () => {
	for (let client of clients) {
		client.ws.close(1000, 'Сворачиваемся');
	}
	process.exit(1);
}

function findClientByName(name) {
	return clients.find((element, index, array) => {
		return element.name === name;
	});
};
