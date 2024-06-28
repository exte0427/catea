import { c as create_ssr_component, a as subscribe, b as add_attribute, e as escape } from "../../../chunks/ssr.js";
import { w as writable } from "../../../chunks/index.js";
import { P as PageModule } from "../../../chunks/pageModule.js";
import "../../../chunks/client.js";
import { S as Server } from "../../../chunks/firebase.js";
const editedPost = writable(``);
const css = {
  code: "#content.svelte-1sjqigu{width:100%;height:300px;margin:10px;border-radius:5px;border-width:0px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $editedPost, $$unsubscribe_editedPost;
  $$unsubscribe_editedPost = subscribe(editedPost, (value) => $editedPost = value);
  let title = "";
  let content = "";
  let category = "";
  let uploadName = "";
  if ($editedPost !== "") {
    Server.getPost($editedPost).then((e) => {
      title = e.title;
      content = e.desc;
      category = e.category;
      editedPost.set(``);
    });
  }
  Server.init();
  $$result.css.add(css);
  $$unsubscribe_editedPost();
  return `<h1 data-svelte-h="svelte-1iu5ycm">Post Form</h1> <form><label for="title" data-svelte-h="svelte-kpfkpc">Title:</label><br> <input type="text" id="title"${add_attribute("value", title, 0)}><br> <label for="category" data-svelte-h="svelte-1qmhjiw">Category:</label><br> <input type="text" id="category"${add_attribute("value", category, 0)}><br> <label for="content" data-svelte-h="svelte-135u9wq">Content:</label><br> <textarea id="content" class="svelte-1sjqigu">${escape(content || "")}</textarea><br><br> <button type="submit" data-svelte-h="svelte-1ou7dtz">Submit</button></form> <h1 data-svelte-h="svelte-19xfttp">Image Form</h1> <input type="file" accept="image/*"> <pre>${escape(uploadName)}</pre> <h1 data-svelte-h="svelte-1w4dp2m">preview</h1> <!-- HTML_TAG_START -->${PageModule.view(content)}<!-- HTML_TAG_END -->`;
});
export {
  Page as default
};
