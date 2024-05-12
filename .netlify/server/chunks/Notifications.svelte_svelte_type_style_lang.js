import { w as writable } from "./index.js";
const KEY = Symbol.for("store.notifications");
const singleton = {};
singleton[KEY] = writable(/* @__PURE__ */ new Set([]));
Object.freeze(singleton);
const store = singleton[KEY];
export {
  store as s
};
