import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
import { i as isAdmin } from "../../../../chunks/isAdmin.js";
import { P as PageModule } from "../../../../chunks/pageModule.js";
import "../../../../chunks/firebase.js";
import "../../../../chunks/client.js";
const css = {
  code: "#title.svelte-1lycep9{margin:-10px;margin-bottom:10px;background-color:#2b2b2b;color:white;font-size:40px;padding:10px;font-weight:bold}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let title = "", desc = "";
  let adminable = false;
  isAdmin.subscribe((value) => {
    adminable = value;
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div id="title" class="svelte-1lycep9">${escape(title)}</div> <!-- HTML_TAG_START -->${PageModule.view(desc)}<!-- HTML_TAG_END --> ${adminable ? `<button data-svelte-h="svelte-3wfokg">delete</button> <button data-svelte-h="svelte-jxwfms">edit</button>` : ``}`;
});
export {
  Page as default
};
