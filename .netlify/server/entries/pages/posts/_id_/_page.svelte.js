import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
import "../../../../chunks/Notifications.svelte_svelte_type_style_lang.js";
import "@tadashi/hex-id";
import { i as isAdmin } from "../../../../chunks/isAdmin.js";
import { P as PageModule } from "../../../../chunks/pageModule.js";
import "../../../../chunks/firebase.js";
import "../../../../chunks/client.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let title = "", desc = "";
  let adminable = false;
  isAdmin.subscribe((value) => {
    adminable = value;
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<h1>${escape(title)}</h1> <!-- HTML_TAG_START -->${PageModule.view(desc)}<!-- HTML_TAG_END --> ${adminable ? `<button data-svelte-h="svelte-3wfokg">delete</button>` : ``}`;
});
export {
  Page as default
};
