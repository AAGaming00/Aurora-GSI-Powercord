const { readFile, writeFile } = require('fs').promises;
const { fstat } = require('fs');
const outdent = require('outdent');
// small script to convert pc format to bd format.
(async () => {
  const file = await readFile('./index.js', 'utf8');
  const bdfile = file
  // header
    .replace(outdent `
    const { Plugin } = require('powercord/entities');
    const { getModule, channels } = require('powercord/webpack');`, outdent `/**
    * @name Aurora-GSI
    * @description Sends information to Aurora about users connecting to/disconnecting from, mute/deafen status
    * @author Popato & DrMeteor
    * @version 2.2.0
    */
    
    function getModule (props) {
    return BdApi.findModuleByProps.apply(null, props);
    }
  `)
  // dumb functions bd requires for some stupid reason
    .replace('class AuroraGSI extends Plugin {', outdent `
class AuroraGSI {
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
                    \`
                        Initial version.
                    \`,
        '1.0.1' :
                    \`
                        Added conditions for only reacting to local user.
                    \`,
        '1.0.2' :
                    \`
                        Removed isBeingCalled.
                        Removed redundant loop.
                    \`,
        '1.0.3' :
                    \`
                        Updated the CDN for the library.
                    \`,
        '1.1' :
                    \`
                        Made the state only be sent if it changed.
                    \`,
        '2.0' :
                    \`
                        Version bump to stop the update prompt derping.
                    \`,
        '2.1.0':
                    \`
                        Allow to track mute/deafen statuses outside voice channels.
                        Fix unread status for Enhanced Discord users.
                        Actually fix self-updating loop
                    \`,
        '2.1.1':
                    \`
                        Fix "being_called" boolean so it's now usable (triggers when user calls and getting called in DMs)
                    \`,
        '2.2.0':
                    \`
                        Rewrite a bunch of stuff
                    \`
        };
    }

          `)
  // function names
    .replace('pluginWillUnload', 'stop')
    .replace('startPlugin', `
  load () {}// legacy

  start`.trim())
  // channels
    .replace('this.channels = channels;', 'this.channels = getModule([ \'getChannelId\' ], false);');


  await writeFile('./AuroraGSI.plugin.js', bdfile);
})();

