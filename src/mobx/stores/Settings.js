import { decorate, observable } from "mobx";

class Settings {
  downsample = 0.3;
  fullRes = false;
}
decorate(Settings, {
  downsample: observable,
  fullRes: observable,
});

export default Settings;
