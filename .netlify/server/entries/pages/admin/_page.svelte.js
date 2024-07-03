import { c as create_ssr_component, a as add_attribute } from "../../../chunks/ssr.js";
import { S as Server } from "../../../chunks/firebase.js";
const css = {
  code: "form.svelte-5wvp74.svelte-5wvp74{display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:100px;background-color:rgb(87, 81, 74)}form.svelte-5wvp74 label.svelte-5wvp74{color:white;font-size:1.5em}form.svelte-5wvp74 input.svelte-5wvp74{width:200px;height:30px;margin:10px;border-radius:5px;border-width:0px}form.svelte-5wvp74 input[type=submit].svelte-5wvp74{background-color:rgb(87, 81, 74);color:white;cursor:pointer;border-radius:5px;border-width:0px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let id = "";
  let password = "";
  Server.init();
  $$result.css.add(css);
  return `<form class="svelte-5wvp74"><label for="id" class="svelte-5wvp74" data-svelte-h="svelte-gb6ka7">email</label> <input type="email" name="email" id="id" class="svelte-5wvp74"${add_attribute("value", id, 0)}> <label for="password" class="svelte-5wvp74" data-svelte-h="svelte-ew6a2y">password</label> <input type="password" name="password" id="password" class="svelte-5wvp74"${add_attribute("value", password, 0)}> <input type="submit" class="svelte-5wvp74"> </form>`;
});
export {
  Page as default
};
