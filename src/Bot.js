const { Client, Intents, Message, User, GuildMember, Channel, Interaction, CommandInteractionOptionResolver, Role } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const Command = require("./Command");
const Context = require("./Context");
const Inputs = require("./Inputs");



const is_num = str => !str.includes(".") && isNaN(Number(str));

class Bot extends Client {
  /**
   * Creates a Bot
   * @param {{
   * prefix :string;
   * token :string;
   * applicationID :string;
   * }} config
   */
  constructor(config) {
    if (!config.prefix) {
      this.prefix = "!";
    }
    if (!config.token) {
      throw new Error("Config object must contain token");
    }
    if (!config.applicationID) {
      throw new Error("Config object must contain applicationID");
    }
    super({
      intents: Object.keys(Intents.FLAGS).map(key => Intents.FLAGS[key])
    });
    this.on("ready", (client) => {
      console.log(client.user.tag);
    });
    this.prefix = config.prefix;
    this.token = config.token;
    this.application_id = config.applicationID;
    /**
     * @type {Map<string[], Command>}
     */
    this.text_command_modules = new Map();
    /**
     * @type {Map<string, Command>}
     */
    this.slash_command_modules = new Map();
    /**
     * @type {Map<string, (i :Interaction) => void}
     */
    this.btn_click_handlers = new Map();
    this.filter_fn = m => !m.tts || !m.system || !m.author.bot;
  }
  /**
   * add a command to the bot
   * @param {(bot :Bot) => Command} setup_fn 
   */
  addCommand(setup_fn) {
    const command_module = setup_fn(this);
    if (command_module.is_slash_command) {
      this.slash_command_modules.set(
        command_module.name, command_module
      );
    }
    else {
      this.text_command_modules.set(
        command_module.aliases.concat(command_module.name),
        command_module
      );
    }
    return this;
  }

  /**
   * Get all modules added by `Bot.addCommand`
   * @returns {Set<Command>}
   */
  getCommands() {
    const module_set = new Set();
    for (let cmd of this.text_command_modules.values()) {
      module_set.add(cmd);
    }
    for (let cmd of this.slash_command_modules.values()) {
      module_set.add(cmd);
    }
    return module_set;
  }
  /**
   * what type of messages/interactions do you want to ignore?
   * @param {(m :Message | Interaction) => void} fn 
   */
  setFilter(fn) {
    this.filter_fn = fn;
  }

  /**
   * almost useless parsing function
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
   * @param {Inputs} command_params
   * @param {string[] | CommandInteractionOptionResolver} actual_args
   * @param {"m"|"i"} mori
   * @param {Message | undefined} message
   * @returns {{
   * [key :string] :(User | Role | Channel | GuildMember)
   * }}
   */
  process_args(command_params, actual_args, mori, message) {
    /**
     * return-ed args
     * @type {{ [key :string] :User | Role | Channel | GuildMember }}
     */
    let args = new Object();
    let i, id;
    if (mori === "m") {
      
      for (i = 0; i < command_params.inputs.length; i++) {
        let cp_input = command_params.inputs[i];
        if (!actual_args[i]) {
          args[cp_input.name.slice(0, cp_input.name.indexOf("!"))] = null;
        }
        else if (actual_args[i].startsWith("<") && actual_args[i].endsWith(">")) {
          
          if (actual_args[i].startsWith("<@!") && is_num(actual_args[i].slice(0, actual_args[j].indexOf(">")))) {
            id = actual_args[i].slice(3, actual_args[i].indexOf(">"));
            console.log(id)
            args[cp_input.name] = message.mentions.users.find(user => user.id === id);
          }
          else if (actual_args[i].startsWith("<@&") && is_num(actual_args[i].slice(0, actual_args[i].indexOf(">")))) {
            id = actual_args[i].slice(3, actual_args[i].indexOf(">"));
            args[cp_input.name] = message.mentions.roles.find(role => role.id === id);
          }
          else if (actual_args[i].startsWith("<#") && is_num(actual_args[i].slice(0, actual_args[i].indexOf(">")))) {
            id = actual_args[i].slice(2, actual_args[i].indexOf(">"));
            args[cp_input.name] = message.mentions.channels.find(channel => channel.id === id);
          }
          else {
            args[cp_input.name] = null;
          }
          
        }
        else {
          args[cp_input.name] = actual_args[i];
        }
      }
      return args;
    }
    else if (mori === "i") {
      for (i = 0; i < command_params.inputs.length; i++) {
        let cp_input = command_params.inputs[i];
        switch (cp_input.type) {
          case "BOOLEAN":
            args[cp_input.name] = actual_args.getBoolean(cp_input.name, cp_input.required);
            break;
          case "CHANNEL":
            args[cp_input.name] = actual_args.getChannel(cp_input.name, cp_input.required);
            break;
          case "INTEGER":
            args[cp_input.name] = actual_args.getInteger(cp_input.name, cp_input.required);
            break;
          case "MENTIONABLE":
            args[cp_input.name] = actual_args.getMentionable(cp_input.name, cp_input.required);
            break;
          case "NUMBER":
            args[cp_input.name] = actual_args.getNumber(cp_input.name, cp_input.required);
            break;
          case "ROLE":
            args[cp_input.name] = actual_args.getRole(cp_input.name, cp_input.required);
            break;
          case "STRING":
            args[cp_input.name] = actual_args.getString(cp_input.name, cp_input.required);
            break;
          case "USER":
            args[cp_input.name] = actual_args.getUser(cp_input.name, cp_input.required);
            break;
          default:
            break;
        }
      }
      return args;
    }
  }

  /**
   * Must be always called at the end of the main bot launching file
   */
  run() {
    const slash_command_put_request_body = [];
    const slash_command_built = new SlashCommandBuilder();
    this.slash_command_modules.forEach((v, k) => {
      slash_command_built.setName(v.name)
      .setDescription(v.description)
      .setDefaultPermission(true);
      v.inputs.inputs.forEach(option => {
        console.log("opt added")
        switch (option.type) {
          case "BOOLEAN":
            slash_command_built.addBooleanOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
          case "CHANNEL":
            slash_command_built.addChannelOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
          case "INTEGER":
            slash_command_built.addIntegerOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
          case "MENTIONABLE":
            slash_command_built.addMentionableOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
          case "NUMBER":
            slash_command_built.addNumberOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
          case "ROLE":
            slash_command_built.addRoleOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
          case "STRING":
            slash_command_built.addStringOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
          case "USER":
            slash_command_built.addUserOption(
              o => o.setRequired(option.required)
              .setName(option.name)
              .setDescription(option.description)
            )
            break;
        }
      });
      slash_command_put_request_body.push(slash_command_built);
    });
    
    new REST({ version: "9" }).setToken(this.token).put(
      Routes.applicationCommands(this.application_id),
      {
        body: slash_command_put_request_body
      }
    );
    this.on("interactionCreate", (interaction) => {
      if (!this.filter_fn(interaction)) return;
      if (interaction.isCommand()) {
        this.slash_command_modules.forEach(modul => {
          if (interaction.commandName === modul.name) {
            modul.execute(new Context(interaction, "i"), this.process_args(modul.inputs, interaction.options, "i"))
              .then(/* Implement Logging */)
              .catch(console.error);
          }
        });
      }
      else {
        console.log("%c idk what this is", "color: red;");
      }
    });
    this.on("messageCreate", message => {
      if (!this.filter_fn(message)) return;
      const params = this.parse2obj(message.content, message.mentions);
      console.log(message.content)
      this.text_command_modules.forEach((mv, mk) => {
        if (mk.includes(params.command)) {
          
          mv.execute(new Context(message, "m"), this.process_args(mv.inputs, params.args, "m", message))
            .then(/* TODO: Implement some sort of logging */)
            .catch(console.error);
        }
      });
    });
    this.login();
  }

  /**
   * 
   * @param {Message} message 
   * @param {string} custom_id 
   * @param {(i :Interaction) => void} handler 
   * @param {number | 10000} time_to_wait_in_ms
   */
  addButtonClickListener(message, btn, handler, time_to_wait_in_ms = 10000) {
    message.awaitMessageComponent({
      filter: i => i.isButton() && i.user.id === this.user.id && i.customId === btn.customId,
      time: time_to_wait_in_ms
    })
    .then(handler)
    .catch(reason => {
      throw new Error(`[Error @addButtonClickListener]: ${reason}`);
    });
  }
}

module.exports = Bot;