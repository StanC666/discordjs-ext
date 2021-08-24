const discordjs = require("discord.js");
const fs = require("fs");
const Command = require("./Command");
const Context = require("./Context");


 /**
   * @typedef {{
  *   name :string;
  *   guild_only :boolean;
  *   alt_names :string[];
  *   nsfw :boolean;
  *   args :{name :string, optional? :boolean}[];
  * }} CommandOpts
  */

class CommandAdder {
  /**
   * 
   * @param {Set<Command>} module_set 
   * @param {object} opts
   */
  constructor(module_set, opts) {
    this.module_set = module_set;
    this.opts = opts;
  }
  add(fn) {
    this.module_set.add(
      new Command(this.opts, fn)
    );
  }
}
class Bot {
  /**
   * Creates a Bot
   * @param {string} token_env_file 
   * @param {string} prefix 
   */
  constructor(prefix = "!", token_env_file = ".env") {
    this.client = new discordjs.Client({
      intents: [
        ...Object.keys(Intents.FLAGS).map(key => Intents.FLAGS[key])
      ]
    });
    
    this.client.on("ready", (client) => {
      console.log(client.user.tag);
    })
    this.prefix = prefix;
    this.TOKEN = "";
    this.modules = new Set();
    this.cmd_names = new Set();
    this.arg_objs = new Set();
    let contents = fs.readFileSync(token_env_file, {encoding: "utf8"});
    for (let i = 0; i < contents.length; i++) {
      if (contents.slice(i, i+7) === "TOKEN=\"") {
        for (let j = i+7; contents[j] !== "\""; j++) {
          this.TOKEN += contents[j];
        }
      }
     }
   
  }
  /**
   * @param {CommandOpts} opts
   * @returns {{ add :(fn :(ctx) => Promise<any>) => void }}
   */
  command(opts) {
    if (!opts) throw new Error("opts is a required argument to call command()")
    if (!opts.name) throw new Error("opts has no name");
    if (!opts.alt_names || !opts.alt_names.length) opts.alt_names = [];
    if (!opts.nsfw) opts.nsfw = true;
    if (!opts.args || !opts.args.length) opts.args = [];
    this.cmd_names.add(opts.name);
    if (opts.alt_names.length != 0) {
      opts.alt_names.forEach(name => this.cmd_names.add(name));
    }
    if (opts.args.length != 0) {
      opts.args.forEach(arg => this.arg_objs.add(arg));
    }
    return new CommandAdder(this.modules, opts);
  }
  /**
   * @private
   * @param {string} content 
   */
  parse2obj(content) {
    const trimmed = content.slice(this.prefix.length).split(/ +/);
    return {
      command: trimmed[0],
      args: trimmed.slice(1)
    };
  }

  run() {
    this.client.on("messageCreate", message => {
      if (message.tts || message.author.bot || message.system) return;
      const params = this.parse2obj(message.content);
      const ctx = new Context(this.client, message, params.args);
      this.modules.forEach(mod => {
        if (mod.options.name === params.command || mod.options.alt_names.includes(params.command)) {
          mod.fn(ctx)
          .then(/* idk what to do here */)
          .catch(console.error);
        }
      });
    });
    this.client.login(this.TOKEN);    
  }
}

module.exports = Bot;
