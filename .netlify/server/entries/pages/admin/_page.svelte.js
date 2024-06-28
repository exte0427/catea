import { c as create_ssr_component, b as add_attribute } from "../../../chunks/ssr.js";
import { S as Server } from "../../../chunks/firebase.js";
const css = {
  code: "form.svelte-1cjxgzw.svelte-1cjxgzw{display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:100px}form.svelte-1cjxgzw label.svelte-1cjxgzw{color:white;font-size:1.5em}form.svelte-1cjxgzw input.svelte-1cjxgzw{width:200px;height:30px;margin:10px;border-radius:5px;border-width:0px}form.svelte-1cjxgzw input[type=submit].svelte-1cjxgzw{background-color:rgb(87, 81, 74);color:white;cursor:pointer;border-radius:5px;border-width:0px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id = "";
  let password = "";
  Server.init();
  $$result.css.add(css);
  return `<form class="svelte-1cjxgzw"><label for="id" class="svelte-1cjxgzw" data-svelte-h="svelte-gb6ka7">email</label> <input type="email" name="email" id="id" class="svelte-1cjxgzw"${add_attribute("value", id, 0)}> <label for="password" class="svelte-1cjxgzw" data-svelte-h="svelte-ew6a2y">password</label> <input type="password" name="password" id="password" class="svelte-1cjxgzw"${add_attribute("value", password, 0)}> <input type="submit" class="svelte-1cjxgzw"> </form>`;
});
export {
  Page as default
};
