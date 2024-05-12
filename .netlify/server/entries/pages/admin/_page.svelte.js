import { c as create_ssr_component, a as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
import { N as Notifications } from "../../../chunks/Notifications.js";
import "@tadashi/hex-id";
import "../../../chunks/Notifications.svelte_svelte_type_style_lang.js";
import { S as Server } from "../../../chunks/firebase.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id = "";
  let password = "";
  Server.init();
  return `<form><label for="id" data-svelte-h="svelte-gb6ka7">email</label> <input type="email" name="email" id="id"${add_attribute("value", id, 0)}> <label for="password" data-svelte-h="svelte-ew6a2y">password</label> <input type="password" name="password" id="password"${add_attribute("value", password, 0)}> <input type="submit"></form> ${validate_component(Notifications, "Notifications").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
