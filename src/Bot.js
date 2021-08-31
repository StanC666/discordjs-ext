const discordjs = require("discord.js");
const fs = require("fs");
const path = require("path");
const Command = require("./Command");

const { Intents } = discordjs;

const is_num = str => !str.includes(".") && isNaN(Number(str));

class Bot extends discordjs.Client {
  /**
   * Creates a Bot
   * @param {string} prefix 
   * @param {{
   * token :string;
   * }} config
   */
  constructor(prefix = "!", config) {
    if (!config.token) {
      throw new Error("Config object must contain token")
    }
    super({
      intents: Object.keys(Intents.FLAGS).map(key => Intents.FLAGS[key])
    });
    this.on("ready", (client) => {
      console.log(client.user.tag);
    })
    this.prefix = prefix;
    /**
     * @type {Map<string[], Command>}
     */
    this.modules = new Map();
    this.token = config.TOKEN;
    this.add_command(require(`../commands/help.js`));
  }
  /**
   * add a command to the bot
   * @param {(bot :Bot) => Command} setup_fn 
   */
  add_command(setup_fn) {
    const command_module = setup_fn(this);
    this.modules.set(command_module.aliases.concat(command_module.name), command_module);
  }

  /**
   * @private
   * @param {string} content
   */
  parse2obj(content) {
    const split = content.slice(this.prefix.length).split(/ +/);
    return {
      command: split[0],
      args: split.slice(1)
    };
  }

  /**
   * @private
   * @param {string[]} command_params
   * @param {string[]} actual_args
   * @param {discordjs.Message} message
   * @returns {{
   * [key :string] :(discordjs.User | discordjs.Role | discordjs.Channel | discordjs.GuildMember)
   * }}
   */
  process_args(command_params, actual_args, message) {
    const args = new Object();
    let i, id;
    for (i = 0; i < command_params.length; i++) {
      if (!actual_args[i]) {
        args[command_params[i].slice(0, command_params[i].indexOf("!"))] = null;
      }
      else if (actual_args[i].startsWith("<") && actual_args[i].endsWith(">")) {
        let aa = actual_args, j = i, cp = command_params;
        if (aa[j].startsWith("<@!") && is_num(aa[j].slice(0, aa[j].indexOf(">")))) {
          id = aa[j].slice(3, aa[j].indexOf(">"));
          console.log(id)
          args[cp[j]] = message.mentions.users.find(user => user.id === id);
        }
        else if (aa[j].startsWith("<@&") && is_num(aa[j].slice(0, aa[j].indexOf(">")))) {
          id = aa[j].slice(3, aa[j].indexOf(">"));
          args[cp[j]] = message.mentions.roles.find(role => role.id === id);
        }
        else if (aa[j].startsWith("<#") && is_num(aa[j].slice(0, aa[j].indexOf(">")))) {
          id = aa[j].slice(2, aa[j].indexOf(">"));
          args[cp[j]] = message.mentions.channels.find(channel => channel.id === id);
        }
        else {
          args[command_params[i]] = null;
        }
        
      }
      else {
        args[command_params[i]] = actual_args[i];
      }
    }
    return args;
  }

  /**
   * Must be always called at the end of the main bot launching file
   */
  run() {
    this.on("messageCreate", message => {
      if (message.tts || message.author.bot || message.system) return;
      const params = this.parse2obj(message.content, message.mentions);
      console.log(message.content)
      this.modules.forEach((mv, mk) => {
        if (mk.includes(params.command)) {
          
          mv.execute(message, this.process_args(mv.args, params.args, message))
            .then(/* TODO: Implement some sort of logging */)
            .catch(console.error);
        }
      });
    });
    this.login();
  }
}

module.exports = Bot;