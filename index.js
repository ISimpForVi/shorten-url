const {
  Plugin
} = require("powercord/entities");
const {
  clipboard
} = require("electron");
const {
  getModule,
  React
} = require("powercord/webpack");
const {
  inject,
  uninject
} = require('powercord/injector');
const {
  getOwnerInstance
} = require('powercord/util');
const {
  ContextMenu: {
    Button
  }
} = require("powercord/components");
const settings = require("./components/settings");

module.exports = class Upload extends Plugin {
  startPlugin() {
    this.registerSettings("shorten-url", "Shorten URL", settings);
    this._injectContextMenu();
  }

  pluginWillUnload() {
    uninject("shorten-url")
  }

  async upload(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (() => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (this.settings.get("copy")) {
          clipboard.writeText(xhr.response)
        }
      }
    })
    xhr.open("POST", "https://" + this.settings.get("domain"))
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify({
      url: url
    }))
  }

  async _injectContextMenu() {
    const menu = await getModule(["MenuItem"])
    const mdl = await getModule(m => m.default && m.default.displayName === 'MessageContextMenu');
    inject('shorten-url', mdl, 'default', ([{
      target
    }], res) => {
      if (target.tagName.toLowerCase() === 'img') {
        res.props.children.splice(4, 0,
          React.createElement(menu.MenuItem, {
            name: "Shorten URL",
            separate: false,
            id: "shorten-url",
            label: "Shorten URL",
            action: () => this.upload(target.src)
          })
        );
      }
      return res;
    });
    mdl.default.displayName = 'MessageContextMenu';
  }
};