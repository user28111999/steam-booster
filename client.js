const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const readlineSync = require('readline-sync');

const bots = {};
 
bots.newBot = function(config) {
	const bot = new SteamUser({
        promptSteamGuardCode: false,
		dataDirectory: "./temp",
		singleSentryfile: false
    });
	
	bot.username = config.username;
	bot.password = config.password;
	bot.sharedSecret = config.sharedSecret;
	bot.games = config.games;
	bot.receivedMessages = {};
	
	bot.on('loggedOn', function() {
		console.log("["+ Date() + " " + this.username + "] Logged into Steam");
		bot.setPersona(SteamUser.EPersonaState.Online);
		bot.gamesPlayed(this.games);
	});
 
	bot.on('error', function(e) {
		console.log("[" + this.username + "] " + e);
		setTimeout(function() { bot.doLogin(); }, 30*60*1000);
	});
 
	bot.doLogin = function () {
		this.logOn({ 
			"accountName": this.username,
			"password": this.password
		});
	}
	
	bot.on('steamGuard', function(domain, callback) {
		if (!this.sharedSecret) {
			const authCode = readlineSync.question("["+ Date() + " " + this.username + "] " + 'Steam Guard' + (!domain ? ' App' : '') + ' Code: ');
			callback(authCode);	
		} else {
			const authCode = SteamTotp.generateAuthCode( this.sharedSecret );
			console.log("["+ Date() + " " + this.username + "] Generated Auth Code: " + authCode);
			callback(authCode);	
		}
	});
	
	bot.on("friendMessage", function(steamID, message) {
		console.log("["+ Date() + " " + this.username + "] Message from " + steamID + ": " + message);
		if (!this.receivedMessages[steamID]) {
			bot.chatMessage(steamID, "[Automated Message] I am currently unavailaible and I'm just idling games using this awesome piece of code! (https://github.com/yunseok/steam-booster)");
			this.receivedMessages[steamID] = true;
		}
	});
	
	return bot;
}
 
module.exports = bots;