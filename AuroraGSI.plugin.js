/**
* @name Aurora-GSI
* @description Sends information to Aurora about users connecting to/disconnecting from, mute/deafen status
* @author Popato & DrMeteor
* @version 2.2.0
*/

function getModule (props) {
return BdApi.findModuleByProps.apply(null, props);
}

module.exports = class AuroraGSI {
    getName () {
        return 'AuroraGSI';
    }

    getDescription () {
        return 'Sends information to Aurora about users connecting to/disconnecting from, mute/deafen status';
    }

    getVersion () {
        return '2.2.0';
    }

    getAuthor () {
        return 'Popato & DrMeteor';
    }

    getChanges () {
        return {
        '1.0.0' :
                    `
                        Initial version.
                    `,
        '1.0.1' :
                    `
                        Added conditions for only reacting to local user.
                    `,
        '1.0.2' :
                    `
                        Removed isBeingCalled.
                        Removed redundant loop.
                    `,
        '1.0.3' :
                    `
                        Updated the CDN for the library.
                    `,
        '1.1' :
                    `
                        Made the state only be sent if it changed.
                    `,
        '2.0' :
                    `
                        Version bump to stop the update prompt derping.
                    `,
        '2.1.0':
                    `
                        Allow to track mute/deafen statuses outside voice channels.
                        Fix unread status for Enhanced Discord users.
                        Actually fix self-updating loop
                    `,
        '2.1.1':
                    `
                        Fix "being_called" boolean so it's now usable (triggers when user calls and getting called in DMs)
                    `,
        '2.2.0':
                    `
                        Rewrite a bunch of stuff
                    `
        };
    }

  getSelectedGuild () {
    return this.getChannel(this.channels.getChannelId()).guild_id;
  }

  getSelectedTextChannel () {
    return this.getChannel(this.channels.getChannelId());
  }

  getSelectedVoiceChannel () {
    return this.getChannel(this.channels.getVoiceChannelId());
  }

  getLocalStatus () {
    return this.getStatus(this.getCurrentUser().id);
  }

  load () {}// legacy

start () {
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
    this.getCurrentUser = getModule([ 'getUser', 'getUsers' ], false).getCurrentUser;
    this.getStatus = getModule([ 'getApplicationActivity' ], false).getStatus;
    this.getChannel = getModule([ 'getChannel' ], false).getChannel;
    this.channels = getModule([ 'getChannelId' ], false);
    const { getUser } = getModule([ 'getUser' ], false),
      voice = getModule([ 'isMute', 'isDeaf', 'isSelfMute', 'isSelfDeaf' ], false),
      { getCalls } = getModule([ 'getCalls' ], false),
      { getUnreadGuilds } = getModule([ 'getUnreadGuilds' ], false),
      { getTotalMentionCount } = getModule([ 'getTotalMentionCount' ], false),
      isMute = voice.isMute.bind(voice),
      isDeaf = voice.isDeaf.bind(voice),
      isSelfMute = voice.isSelfMute.bind(voice),
      isSelfDeaf = voice.isSelfDeaf.bind(voice);
      /*
       * { getChannel } = getModule([ 'getChannel' ], false), // we dont use this yet
       * const { getVoiceStates } = getModule([ 'getVoiceState' ], false),
       */
    this.updatetimer = setInterval(() => {
      // eslint-disable-next-line consistent-this
      const guild = this.getSelectedGuild();
      const localUser = this.getCurrentUser();
      const localStatus = this.getLocalStatus();
      const textChannel = this.getSelectedTextChannel();
      const voiceChannel = this.getSelectedVoiceChannel();
      /*
       * if (voiceChannel) {
       *   var voiceStates = getVoiceStates(voiceChannel.guild_id);
       * } not implemented
       */

      if (localUser && localStatus) {
        this.json.user.id = localUser.id;
        this.json.user.status = localStatus;
      } else {
        this.json.user.id = -1;
        this.json.user.status = '';
      }

      if (guild) {
        this.json.guild.id = guild.id;
        this.json.guild.name = guild.name;
      } else {
        this.json.guild.id = -1;
        this.json.guild.name = '';
      }

      if (textChannel) {
        this.json.text.id = textChannel.id;
        if (textChannel.type === 0) { // text channel
          this.json.text.type = 0;
          this.json.text.name = textChannel.name;
        } else if (textChannel.type === 1) { // pm
          this.json.text.type = 1;
          this.json.text.name = getUser(textChannel.recipients[0]).username;
        } else if (textChannel.type === 3) { // group pm
          this.json.text.type = 3;
          if (textChannel.name) {
            this.json.text.name = textChannel.name;
          } else {
            let newname = '';
            for (let i = 0; i < textChannel.recipients.length; i++) {
              const user = textChannel.recipients[i];
              newname += `${getUser(user).username} `;
            }
            this.json.text.name = newname;
          }
        }
      } else {
        this.json.text.id = -1;
        this.json.text.type = -1;
        this.json.text.name = '';
      }

      if (voiceChannel) {
        if (voiceChannel.type === 1) { // call
          this.json.voice.type = 1;
          this.json.voice.id = voiceChannel.id;
          this.json.voice.name = getUser(voiceChannel.recipients[0]).username;
        } else if (voiceChannel.type === 2) { // voice channel
          this.json.voice.type = 2;
          this.json.voice.id = voiceChannel.id;
          this.json.voice.name = voiceChannel.name;
        }
      } else {
        this.json.voice.id = -1;
        this.json.voice.type = -1;
        this.json.voice.name = '';
      }

      this.json.user.self_mute = isSelfMute();
      this.json.user.self_deafen = isSelfDeaf();
      this.json.user.mute = isMute();
      this.json.user.deafen = isDeaf();

      this.json.user.unread_messages = false;
      this.json.user.mentions = false;
      this.json.user.being_called = false;

      this.json.user.mentions = getTotalMentionCount();
      this.json.user.unread_messages = Object.values(getUnreadGuilds()).length;

      if (getCalls().filter((x) => x.ringing.length > 0).length > 0) {
        this.json.user.being_called = true;
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

  stop () {
    clearInterval(this.updatetimer);
    // this.unpatch();
    this.ready = false;
  }
};
