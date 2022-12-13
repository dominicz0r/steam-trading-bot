const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const config = require('./config.json');

const login = config.login;
const passwd = config.passwd;
const tfa_code = SteamTotp.generateAuthCode(config.tfa_code)
const ident_secret = config.ident_secret;

const date_of_auth = new Date("12/28/2022");

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
	steam: client,
	community: community,
	language: 'en'
});

const logOnOptions = {
	accountName: login,
	password: passwd,
	twoFactorCode: tfa_code
};

client.logOn(logOnOptions);
client.on('loggedOn', () => {
	console.log('Zalogowano');
	client.setPersona(SteamUser.EPersonaState.Online, "^Edmund | Trade-locked...");
	client.gamesPlayed(440);
});

client.on('friendRelationship', function(steamID, relationship) {
	if (relationship == 2) {
		console.log('Otrzymano nowe zaproszenie od: ' + steamid)
		client.addFriend(steamID);
		var Curr_date = new Date();
		var TimeLeft = parseInt((date_of_auth - Curr_date) / (1000*60*60*24));
		setTimeout(function() {
			client.chatMessage(steamid, '/pre Hi! I\'m Edmund. I was made by ^pvblo \nhttps://steamcommunity.com/id/pablllooo');
			setTimeout(function() {
				client.chatMessage(steamid, '/pre Current mode: Waiting for Steam Guard trade-lock \nAt the moment, I\'m waiting for trade-lock to come off, since I\'m a new account. \nDays left: '+ TimeLeft);
				setTimeout(function() {
					client.chatMessage(steamid, '/pre If you need any help in the future, please write !help');
				}, 3000);
			}, 3000);
		}, 1000);
	}
});

client.on("friendMessage", function(steamID, message) {
	if (message == "!help"){
		var Curr_date = new Date();
		var TimeLeft = parseInt((date_of_auth - Curr_date) / (1000*60*60*24));
		setTimeout(function() {
			client.chatMessage(steamID, '/pre Hi! I\'m Edmund. I was made by ^pvblo \nhttps://steamcommunity.com/id/pablllooo');
			setTimeout(function() {
				client.chatMessage(steamID, '/pre Current mode: Waiting for Steam Guard trade-lock \nAt the moment, I\'m waiting for trade-lock to come off, since I\'m a new account. \nDays left: '+ TimeLeft);
			}, 3000);
		}, 1000);
	}
}); 

client.on('friendsList', () => {
	for (var steamID in client.myFriends){
		var relationship = client.myFriends[steamID];
		if (relationship == SteamUser.EFriendRelationship.RequestRecipient) {
		console.log('Otrzymano nowe zaproszenie OFFLINE od: ' + steamID)
		client.addFriend(steamID);
		var Curr_date = new Date();
		var TimeLeft = parseInt((date_of_auth - Curr_date) / (1000*60*60*24));
		setTimeout(function(steamID) {
			client.chatMessage(steamID, '/pre Hi! I\'m Edmund. I was made by ^pvblo \nhttps://steamcommunity.com/id/pablllooo');
			setTimeout(function(steamID) {
				client.chatMessage(steamID, '/pre Current mode: Waiting for Steam Guard trade-lock \nAt the moment, I\'m waiting for trade-lock to come off, since I\'m a new account. \nDays left: '+ TimeLeft);
				setTimeout(function(steamID) {
					client.chatMessage(steamID, '/pre If you need any help in the future, please write !help');
				}, 3000);
			}, 3000);
		}, 1000);
	}
}
})

client.on('webSession', (sessionid, cookies) => {
  manager.setCookies(cookies);

  community.setCookies(cookies);
  community.startConfirmationChecker(10000, ident_secret);
});

manager.on('newOffer', offer => {
  if (offer.itemsToGive.length === 0) {
    offer.accept((err, status) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Donation accepted. Status: ${status}.`);
      }
    });
  } else {
    offer.decline(err => {
      if (err) {
        console.log(err);
      } else {
        console.log('Donation declined (wanted our items).');
      }
    });
  }
});
