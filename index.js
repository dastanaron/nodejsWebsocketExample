const fs = require('fs');


const salt = 'abc';

let inputString = 'тест';

let cryptedString = '';

cryptedString = crypt(salt, inputString);

decrypt(salt, cryptedString);

function crypt(salt, string) {
	let inputStringSymbols = [];
	let crypted = '';

	let sumSalt = 0;

	for (let symbol in salt) {
		sumSalt += salt[symbol].charCodeAt();
	}

	for (let symbol in string) {
		let char = string[symbol].charCodeAt() ^ sumSalt;
    	crypted += String.fromCharCode(char);
	}

	console.log(crypted);

	return Buffer.from(crypted).toString('base64');
}

function decrypt(salt, crypted) {
	let sumSalt = 0;

	for (let symbol in salt) {
		sumSalt += salt[symbol].charCodeAt();
	}

	let decodedBase64 = Buffer.from(crypted, 'base64').toString();
	let decrypted = '';
	
	for (let symbol in decodedBase64) {
		let char = decodedBase64[symbol].charCodeAt() ^ sumSalt;
    	decrypted += String.fromCharCode(char);
	}

	console.log(decrypted);
}
