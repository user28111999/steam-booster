var SteamUser = require('steam-user');
var SteamTOTP = require('steam-totp');
var UserConfig = require('./user.json');

setTimeout(function () {
	process.exit(0);
}, 1000 * 3600 * 2);

var client = new SteamUser();

var userConfig = {
	'accountName': UserConfig.account_name,
	'password': UserConfig.password,
	'twoFactorCode': SteamTOTP.generateAuthCode(UserConfig.shared_secret)
};

client.logOn(userConfig);

client.on('loggedOn', function(details) {
	console.log('Success!')
	client.webLogOn();
	client.setPersona(1);
	client.gamesPlayed(UserConfig.playing)
});
