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
    const { getVoiceStates } = getModule([ 'getVoiceState' ], false),
      { getUser } = getModule([ 'getUser' ], false),
      { getChannel } = getModule([ 'getChannel' ], false),
      { getCalls } = getModule([ 'getCalls' ], false),
      getLanguage = document.documentElement.lang;

    // this.jsonTimer = setInterval( this.sendJsonToAurora, 50, this.json );

    switch (getLanguage) {
      case 'en-US':
        var mute = '[aria-label="Mute"]';
        var deafen = '[aria-label="Deafen"]';
        break;
      case 'en-GB':
        var mute = '[aria-label="Mute"]';
        var deafen = '[aria-label="Deafen"]';
        break;
      case 'pl':
        var mute = '[aria-label="Wycisz"]';
        var deafen = '[aria-label="Wyłącz dźwięk"]';
        break;
      case 'da':
        var mute = '[aria-label="Gør stum"]';
        var deafen = '[aria-label="Gør døv"]';
        break;
      case 'de':
        var mute = '[aria-label="Stummschalten"]';
        var deafen = '[aria-label="Ein- und Ausgabe deaktivieren"]';
        break;
      case 'es-ES':
        var mute = '[aria-label="Silenciar"]';
        var deafen = '[aria-label="Ensordecer"]';
        break;
      case 'fr':
        var mute = '[aria-label="Rendre muet"]';
        var deafen = '[aria-label="Mettre en sourdine"]';
        break;
      case 'hr':
        var mute = '[aria-label="Isključi mikrofon"]';
        var deafen = '[aria-label="Isključi zvuk"]';
        break;
      case 'it':
        var mute = '[aria-label="Silenzia"]';
        var deafen = '[aria-label="Silenzia l\'audio"]';
        break;
      case 'lt':
        var mute = '[aria-label="Nutildyti"]';
        var deafen = '[aria-label="Išjungti garsą"]';
        break;
      case 'hu':
        var mute = '[aria-label="Némítás"]';
        var deafen = '[aria-label="Süketítés"]';
        break;
      case 'hl':
        var mute = '[aria-label="Dempen"]';
        var deafen = '[aria-label="Hoorbaar maken"]';
        break;
      case 'no':
        var mute = '[aria-label="Demp"]';
        var deafen = '[aria-label="Slå av lyd"]';
        break;
      case 'pt-BR':
        var mute = '[aria-label="Desativar microfone"]';
        var deafen = '[aria-label="Desativar áudio"]';
        break;
      case 'ro':
        var mute = '[aria-label="Dezactivează microfonul"]';
        var deafen = '[aria-label="Dezactivează sunetul"]';
        break;
      case 'fi':
        var mute = '[aria-label="Mykistä"]';
        var deafen = '[aria-label="Hiljennä"]';
        break;
      case 'sv-SE':
        var mute = '[aria-label="Mikrofon av"]';
        var deafen = '[aria-label="Ljud av"]';
        break;
      case 'vi':
        var mute = '[aria-label="Tắt âm"]';
        var deafen = '[aria-label="Tắt tiếng"]';
        break;
      case 'tr':
        var mute = '[aria-label="Sustur"]';
        var deafen = '[aria-label="Sağırlaştır"]';
        break;
      case 'cs':
        var mute = '[aria-label="Ztlumit mikrofon"]';
        var deafen = '[aria-label="Ztlumit zvuk"]';
        break;
      case 'el':
        var mute = '[aria-label="Σίγαση"]';
        var deafen = '[aria-label="Κώφωση"]';
        break;
      case 'bg':
        var mute = '[aria-label="Изкл. на микрофона"]';
        var deafen = '[aria-label="Заглушаване"]';
        break;
      case 'ru':
        var mute = '[aria-label="Откл. микрофон"]';
        var deafen = '[aria-label="Откл. звук"]';
        break;
      case 'uk':
        var mute = '[aria-label="Вимкнути мікрофон"]';
        var deafen = '[aria-label="Вимкнути звук"]';
        break;
      case 'th':
        var mute = '[aria-label="ปิดเสียง"]';
        var deafen = '[aria-label="ปิดการได้ยิน"]';
        break;
      case 'zh-CN':
        var mute = '[aria-label="麦克风静音"]';
        var deafen = '[aria-label="耳机静音"]';
        break;
      case 'ja':
        var mute = '[aria-label="ミュート"]';
        var deafen = '[aria-label="スピーカーミュート"]';
        break;
      case 'zh-TW':
        var mute = '[aria-label="靜音"]';
        var deafen = '[aria-label="拒聽"]';
        break;
      case 'ko':
        var mute = '[aria-label="마이크 음소거 "]';
        var deafen = '[aria-label="헤드셋 음소거 "]';
        break;
      default:
        console.log('Something is borken... can\'t find language');
    }
    this.updatetimer = setInterval(() => {
      var self = this;

      var guild = this.getSelectedGuild();
      var localUser = this.getLocalUser();
      var localStatus = this.getLocalStatus();
      var textChannel = this.getSelectedTextChannel();
      var voiceChannel = this.getSelectedVoiceChannel();
      if (voiceChannel) {
        var voiceStates = getVoiceStates(voiceChannel.guild_id);
      }

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

      self.json.user.self_mute = document.querySelector(mute).getAttribute('aria-checked');
      self.json.user.self_deafen = document.querySelector(deafen).getAttribute('aria-checked');

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
      .catch(error => undefined);
  }

  pluginWillUnload () {
    console.log('help');
    clearInterval(this.updatetimer);
    // this.unpatch();
    this.ready = false;
  }
};
