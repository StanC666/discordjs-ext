class InputComponent {
  /**
   * 
   * @param {string} name 
   * @param {string} description 
   * @param {"BOOLEAN"|"USER"|"STRING"|"ROLE"|"CHANNEL"|"MENTIONABLE"|"INTEGER"|"NUMBER"} type 
   * @param {boolean} required
   */
  constructor(name, description, type, required) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.required = required;
  }
}

module.exports = InputComponent;