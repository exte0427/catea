import { c as create_ssr_component, a as add_attribute, e as escape } from "../../../chunks/ssr.js";
import { P as PageModule } from "../../../chunks/pageModule.js";
import "../../../chunks/client.js";
import { S as Server } from "../../../chunks/firebase.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let title = "";
  let content = "";
  let uploadName = "";
  Server.init();
  return `<h1 data-svelte-h="svelte-1iu5ycm">Post Form</h1> <form><label for="title" data-svelte-h="svelte-kpfkpc">Title:</label><br> <input type="text" id="title"${add_attribute("value", title, 0)}><br> <label for="content" data-svelte-h="svelte-135u9wq">Content:</label><br> <textarea id="content">${escape("")}</textarea><br><br> <button type="submit" data-svelte-h="svelte-1ou7dtz">Submit</button></form> <h1 data-svelte-h="svelte-19xfttp">Image Form</h1> <input type="file" accept="image/*"> <pre>${escape(uploadName)}</pre> <h1 data-svelte-h="svelte-1w4dp2m">preview</h1> <!-- HTML_TAG_START -->${PageModule.view(content)}<!-- HTML_TAG_END -->`;
});
export {
  Page as default
};
