const {React} = require("powercord/webpack");
const {TextInput, SwitchItem, FormItem} = require("powercord/components/settings");

module.exports = ({getSetting, updateSetting, toggleSetting}) => (
  <div>
    <TextInput
      note="The domain to be used for uploading."
      required={true}
      value={getSetting("domain")}
      onChange={val => updateSetting("domain", val)}
    >
      Domain
    </TextInput>
    <SwitchItem
      note="Whether to copy the URL to your clipboard."
      value={getSetting("copy", false)}
      onChange={() => toggleSetting("copy")}
    >
      Copy to Clipboard
    </SwitchItem>
  </div>
)