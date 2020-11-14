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
    const { getModule, channels } = require('powercord/webpack');`, outdent `
    //META{"name":"AuroraGSI","website":"http://www.project-aurora.com/","source":"https://github.com/Popat0/Discord-GSI/blob/master/AuroraGSI.plugin.js"}*//

    /*@cc_on
    @if (@_jscript)
        
        // Offer to self-install for clueless users that try to run this directly.
        var shell = WScript.CreateObject("WScript.Shell");
        var fs = new ActiveXObject("Scripting.FileSystemObject");
        var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
        var pathSelf = WScript.ScriptFullName;
        // Put the user at ease by addressing them in the first person
        shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
        if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
            shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
        } else if (!fs.FolderExists(pathPlugins)) {
            shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
        } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
            fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
            // Show the user where to put plugins in the future
            shell.Exec("explorer " + pathPlugins);
            shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
        }
        WScript.Quit();
    @else@*/
    
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

