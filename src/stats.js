const Greeting = require("./Base");

module.exports = class Stats extends Greeting {
  constructor(username) {
  	super();
    this.user = username;
  }
}