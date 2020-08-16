/* eslint-disable no-redeclare */
/* eslint-disable no-var */
const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

module.exports = class AuroraGSI extends Plugin {
  constructor () {
    super();
    this.json = {
      provider: {
        name: 'discord',
        appid: -1
      },
      user:{
        id: -1,
        status: 'undefined',
        self_mute: false,
        self_deafen : false,
        mentions: false,
        unread_messages: false,
        being_called: false
      },
      guild: {
        id: -1,
        name: ''
      },
      text: {
        id: -1,
        type: -1,
        name: ''
      },
      voice: {
        id: -1,
        type: -1,
        name: ''
      }
    };
    // eslint-disable-next-line no-unused-expressions
    this.lastJson;
  }

  getSelectedGuild () {
    return getModule([ 'getGuild' ], false).getGuild(getModule([ 'getLastSelectedGuildId' ], false).getGuildId()
    );
  }

  getSelectedTextChannel () {
    return getModule([ 'getChannel', 'getChannels' ], false).getChannel(getModule([ 'getChannelId', 'getVoiceChannelId' ], false).getVoiceChannelId());
  }

  getSelectedVoiceChannel () {
    return getModule([ 'getChannel', 'getChannels' ], false).getChannel(getModule([ 'getChannelId', 'getVoiceChannelId' ], false).getChannelId());
  }

  getLocalUser () {
    return getModule([ 'getUser', 'getUsers' ], false).getCurrentUser();
  }

  getLocalStatus () {
    return getModule([ 'getApplicationActivity' ], false).getStatus(this.getLocalUser().id);
  }

  startPlugin () {
    const { getUser } = getModule([ 'getUser' ], false),
      { getCalls } = getModule([ 'getCalls' ], false);
    this.mute = `[aria-label="${require('powercord/webpack').i18n.Messages.MUTE}"]`;
    this.deafen = `[aria-label="${require('powercord/webpack').i18n.Messages.DEAFEN}"]`;
    /*
     * { getChannel } = getModule([ 'getChannel' ], false), // we dont use this yet
     * const { getVoiceStates } = getModule([ 'getVoiceState' ], false),
     */
    this.updatetimer = setInterval(() => {
      // eslint-disable-next-line consistent-this
      var self = this;

      var guild = self.getSelectedGuild();
      var localUser = self.getLocalUser();
      var localStatus = self.getLocalStatus();
      var textChannel = self.getSelectedTextChannel();
      var voiceChannel = self.getSelectedVoiceChannel();
      /*
       * if (voiceChannel) {
       *   var voiceStates = getVoiceStates(voiceChannel.guild_id);
       * } not implemented
       */

      if (localUser && localStatus) {
        self.json.user.id = localUser.id;
        self.json.user.status = localStatus;
      } else {
        self.json.user.id = -1;
        self.json.user.status = '';
      }

      if (guild) {
        self.json.guild.id = guild.id;
        self.json.guild.name = guild.name;
      } else {
        self.json.guild.id = -1;
        self.json.guild.name = '';
      }

      if (textChannel) {
        self.json.text.id = textChannel.id;
        if (textChannel.type === 0) { // text channel
          self.json.text.type = 0;
          self.json.text.name = textChannel.name;
        } else if (textChannel.type === 1) { // pm
          self.json.text.type = 1;
          self.json.text.name = getUser(textChannel.recipients[0]).username;
        } else if (textChannel.type === 3) { // group pm
          self.json.text.type = 3;
          if (textChannel.name) {
            self.json.text.name = textChannel.name;
          } else {
            let newname = '';
            for (let i = 0; i < textChannel.recipients.length; i++) {
              const user = textChannel.recipients[i];
              newname += `${getUser(user).username} `;
            }
            self.json.text.name = newname;
          }
        }
      } else {
        self.json.text.id = -1;
        self.json.text.type = -1;
        self.json.text.name = '';
      }

      if (voiceChannel) {
        if (voiceChannel.type === 1) { // call
          self.json.voice.type = 1;
          self.json.voice.id = voiceChannel.id;
          self.json.voice.name = getUser(voiceChannel.recipients[0]).username;
        } else if (voiceChannel.type === 2) { // voice channel
          self.json.voice.type = 2;
          self.json.voice.id = voiceChannel.id;
          self.json.voice.name = voiceChannel.name;
        }
      } else {
        self.json.voice.id = -1;
        self.json.voice.type = -1;
        self.json.voice.name = '';
      }

      self.json.user.self_mute = document.querySelector(self.mute).getAttribute('aria-checked');
      self.json.user.self_deafen = document.querySelector(self.deafen).getAttribute('aria-checked');

      self.json.user.unread_messages = false;
      self.json.user.mentions = false;
      self.json.user.being_called = false;
      if (document.querySelector('[class^="numberBadge-"]')) {
        self.json.user.mentions = true;
      }
      if (Object.values(getModule([ 'getUnreadGuilds' ], false).getUnreadGuilds()).length > 0) {
        self.json.user.unread_messages = true;
      }
      if (getCalls().filter((x) => x.ringing.length > 0).length > 0) {
        self.json.user.being_called = true;
      }

      if (JSON.stringify(this.json) !== this.lastJson) {
        this.lastJson = JSON.stringify(this.json);
        this.sendJsonToAurora(this.json);
      }
    }, 100);
  }

  async sendJsonToAurora (json) {
    fetch('http://localhost:9088/', {
      method: 'POST',
      body: JSON.stringify(json),
      mode:'no-cors',
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .catch(error => console.log(`Aurora GSI error: ${error}`));
  }

  pluginWillUnload () {
    console.log('help');
    clearInterval(this.updatetimer);
    // this.unpatch();
    this.ready = false;
  }
};
