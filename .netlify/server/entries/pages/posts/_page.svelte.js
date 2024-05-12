import { c as create_ssr_component, e as escape, d as each, v as validate_component } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
import "../../../chunks/firebase.js";
const css = {
  code: "#inner.svelte-10nglpo{border-width:0px;width:100%;background-color:white;margin-bottom:10px;padding:10px}",
  map: null
};
const PostCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { postData } = $$props;
  if ($$props.postData === void 0 && $$bindings.postData && postData !== void 0)
    $$bindings.postData(postData);
  $$result.css.add(css);
  return `<button id="inner" class="svelte-10nglpo"><h2>${escape(postData.title)}</h2> ${escape(postData.desc)} </button>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let posts = [];
  return `<h1 data-svelte-h="svelte-91knqx">post lists</h1> <div>${each(posts, (post) => {
    return `${validate_component(PostCard, "PostCard").$$render($$result, { postData: post }, {}, {})}`;
  })}</div>`;
});
export {
  Page as default
};
