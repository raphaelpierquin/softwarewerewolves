const util = require('util');
const xmpp = require('node-xmpp');
const events = require('events');

const keep_alive_interval = 30000;
const srv = 'jabber.org';

function Resource(jid, password, host){

    const self = this;

    self.srv = srv;

    events.EventEmitter.call(this);

    self.client = this.client || new xmpp.Client({jid: jid, password: password, host: host});

    self.client.on('error', function(e){
        self.error('error for ' + client.jid + ': ' + e);
    });

    self.client.on('stanza', function (stanza) {
        util.log('stanza: ' + stanza);
        if (stanza.is('presence')){
            self.emit('presence', stanza);
        } else if (stanza.is('iq')){
            self.emit('iq', stanza);
        } else if (stanza.is('message')){
            self.emit('message', stanza);
        } else {
            self.error('unrecognized stanza: ' + stanza);
        }
    });


    self.client.once('online', function() {
        util.log(self.client.jid + ' is online');
        // send the initial presence stanza
        self.client.send(new xmpp.Element('presence'));
        // send keepalive data or server will disconnect us after 150s of inactivity
        self.intervalId = setInterval(function () {
            self.client.send(' ');
            setTimeout(self.send_keep_alive, keep_alive_interval);
        }, keep_alive_interval);
    });
};

util.inherits(Resource, events.EventEmitter);

Resource.prototype.error = function error(msg) {
    util.log(msg);
    this.end();
};

Resource.prototype.end = function(){
    clearInterval(this.intervalId);
    this.client.send(new xmpp.Presence({type: 'unavailable'}));
    this.client.removeAllListeners();
    this.client.end();
};

const helpers = {
    createClient: function(jid, password, host){
        return new xmpp.Client({jid: jid, password: password, host: host});
    }
};

module.exports = Resource;