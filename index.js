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
  inject
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

  async upload(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (() => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (this.settings.get("copy")) {
          console.log(xhr.response)
          clipboard.writeText(xhr.response, "selection")
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
    const {
      contextMenu
    } = await getModule(["contextMenu"]);
    const {
      imageWrapper
    } = await getModule(["imageWrapper"]);
    const callback = () =>
      setTimeout(async () => {
        const element = document.querySelector(`.${contextMenu}`);
        if (element) {
          const instance = getOwnerInstance(element);
          if (instance._reactInternalFiber.child.child.pendingProps.type === 'MESSAGE_MAIN') {
            window.removeEventListener('contextmenu', callback, true);
            const fn = instance._reactInternalFiber.child.child.type;
            const mdl = await getModule(m => m.default === fn);
            inject('shorten-url', mdl, 'default', ([{
              target
            }], res) => {
              if (target.tagName.toLowerCase() === 'img' && target.parentElement.classList.contains(imageWrapper)) {
                res.props.children.push(
                  React.createElement(Button, {
                    name: 'Shorten URL',
                    separate: false,
                    onClick: () => this.upload(target.src)
                  })
                );
              }
              return res;
            });
            instance.forceUpdate();
          }
        }
      }, 5);
    window.addEventListener('contextmenu', callback, true);
  }
};