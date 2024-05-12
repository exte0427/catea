import hexID from "@tadashi/hex-id";
import { s as store } from "./Notifications.svelte_svelte_type_style_lang.js";
const base = {
  mode: "normal",
  message: "",
  lifetime: 0
};
function add(notification) {
  notification = {
    ...base,
    ...notification,
    id: `tadashi_svelte_notification_${hexID()}`
  };
  store.update((n) => {
    n.add(notification);
    return n;
  });
}
function remove(notification) {
  store.update((n) => {
    n.delete(notification);
    return n;
  });
}
export {
  add as a,
  remove as r
};
