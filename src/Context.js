const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js");
class Context {
  /**
   * 
   * @param {Message | Interaction } message_or_interaction
   * @param {"m"|"i"} what_it_is
   */
  constructor(message_or_interaction, what_it_is) {
    if (what_it_is === "m") {
      this.is_interaction = false;
    } 
    else {
      this.is_interaction = true;
    }
    this.wrapped = message_or_interaction;
    this.MessageActionRow = MessageActionRow;
    this.MessageButton = MessageButton;
    this.MessageEmbed = MessageEmbed;
    this.MessageSelectMenu = MessageSelectMenu;
  }

  reply(stuff) {
    this.wrapped.reply({
      content: stuff.text_content ? stuff.text_content : null,
      components: stuff.buttons.length !== 0 ? [new MessageActionRow()
      .addComponents([ stuff.buttons, stuff.selectMenus])] : [],
      embeds: stuff.embeds.length !== 0 ? stuff.embeds : [],
      files: stuff.files.length !== 0 ? stuff.files : [],
      stickers: stuff.stickers.length !== 0 ? stuff.stickers : [],
      allowedMentions: stuff.allowedMentions.hasOwnProperty("parse") && stuff.allowedMentions.hasOwnProperty("roles") && stuff.allowedMentions.hasOwnProperty("repliedUser") ? stuff.allowedMentions : {
        roles: [], repliedUser: false, parse: [ "everyone" ]
      }
    });
  }

  getChannel() {
    return this.wrapped.channel;
  }

  isInteraction() {
    return this.is_interaction;
  }
  
  mentionAuthor() {
    return `<@${this.wrapped.author.id}>`;
  }

  getAuthor() {
    return this.wrapped.author;
  }

  inGuild() {
    return this.wrapped.channel.type.includes("GUILD_");
  }

  inDM() {
    return this.wrapped.channel.type === "DM";
  }

  inGroupDM() {
    return this.wrapped.channel.type === "GROUP_DM";
  }

  inTextChannel() {
    return this.wrapped.channel.isText();
  }

  inThreadChannel() {
    return this.wrapped.channel.isThread();
  }

  isPartial() {
    return this.wrapped.channel.partial;
  }
  inVoiceChannel() {
    return this.wrapped.channel.isVoiceChannel();
  }

  getMessage() {
    return this.wrapped;
  }

  getMessageGuild() {
    return this.wrapped.guild;
  }

  getAuthorAsMember() {
    return this.wrapped.member;
  }

}

module.exports = Context;