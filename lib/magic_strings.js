/*
all the magic strings that are observable by users should be in here.
 */

function MagicStrings(){
	this.magicStrings = {}
    // to request or to set the time to wait between the first player registering interest and the game actually starting
    this.loadMagicString('WAITTIME', 'WAITTIME ');
    // the string sent to the user who requests or sets the time to wait between the first player registering interest and the game actually starting
	this.loadMagicString('WAITTIME_RESPONSE', ['currently the game co-ordinator is waiting ', 's before opening the chat room']);
    // the string a user has to send in the message body to indicate he wants to play
    this.loadMagicString('PLAY_REQUEST_STRING', 'I want to play');
}

MagicStrings.prototype.getMagicString = function(key){
	if (this.magicStrings[key] == undefined) throw new Error('retrieving value for non-existing key');this
	return this.magicStrings[key];
}

MagicStrings.prototype.loadMagicString = function(key, value){
	this.magicStrings[key] = value;
}

module.exports.MagicStrings = MagicStrings;