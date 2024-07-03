import { c as create_ssr_component, e as escape, a as add_attribute, v as validate_component, j as each } from "../../../chunks/ssr.js";
import { L as Loading } from "../../../chunks/Loading.js";
import "../../../chunks/client.js";
import { P as PageModule } from "../../../chunks/pageModule.js";
import "../../../chunks/firebase.js";
const css$1 = {
  code: '#inner.svelte-19mpo2m.svelte-19mpo2m{border-width:0px;width:100%;background-color:rgb(87, 81, 74);margin:10px;margin-bottom:0;padding:10px;cursor:pointer;box-shadow:5px 5px 0 rgba(50, 49, 47, 0.654);color:white;border-radius:5px;transition:0.3s;font-family:"Jua", sans-serif}#inner.svelte-19mpo2m p.svelte-19mpo2m{color:white}#inner.svelte-19mpo2m.svelte-19mpo2m:hover{box-shadow:0px 0px 0 rgba(50, 49, 47, 0.654);transform:translate(5px, 5px)}#title.svelte-19mpo2m.svelte-19mpo2m{font-size:1.5em}#category.svelte-19mpo2m.svelte-19mpo2m{background-color:white;color:rgb(87, 81, 74);padding:2px;border-radius:5px}',
  map: null
};
const PostCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { postData } = $$props;
  if ($$props.postData === void 0 && $$bindings.postData && postData !== void 0)
    $$bindings.postData(postData);
  $$result.css.add(css$1);
  return `<button id="inner" class="svelte-19mpo2m"><strong id="title" class="svelte-19mpo2m">${escape(postData.title)}</strong> <p class="svelte-19mpo2m">${escape(PageModule.getDate(postData.date))} <strong id="category" class="svelte-19mpo2m">${escape(postData.category)}</strong></p> </button>`;
});
const css = {
  code: "@media(max-width: 767px){#searchDiv.svelte-13d2amd.svelte-13d2amd{flex-direction:column;align-items:center}#searchDiv.svelte-13d2amd .svelte-13d2amd:first-child{margin-bottom:10px}#searchDiv.svelte-13d2amd #category.svelte-13d2amd{width:80%;margin-left:0}}#searchDiv.svelte-13d2amd.svelte-13d2amd{display:flex;justify-content:center;margin:-10px;background-color:rgb(87, 81, 74);margin:-10px -10px 0 -10px;padding:20px}#searchQuery.svelte-13d2amd.svelte-13d2amd{width:80%;height:30px;border:0;border-radius:5px;padding:5px;box-shadow:5px 5px 0px rgba(50, 49, 47, 0.654)}#category.svelte-13d2amd.svelte-13d2amd{height:40px;margin-left:10px;border:0;border-radius:5px;padding:5px;box-shadow:5px 5px 0px rgba(50, 49, 47, 0.654)}input.svelte-13d2amd.svelte-13d2amd:focus{outline:none}select.svelte-13d2amd.svelte-13d2amd:focus{outline:none}div.svelte-13d2amd.svelte-13d2amd{display:flex;flex-wrap:wrap;justify-content:center}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let posts = [];
  let visiblePosts = [];
  let searchQuery = "";
  let category = "all";
  $$result.css.add(css);
  visiblePosts = posts.filter((e) => {
    if (e.title.includes(searchQuery) && category == "all") {
      return true;
    }
    return false;
  });
  return `<div id="searchDiv" class="svelte-13d2amd"><input type="text" name="searchQuery" id="searchQuery" autocomplete="off" class="svelte-13d2amd"${add_attribute("value", searchQuery, 0)}>  <select name="category" id="category" class="svelte-13d2amd"><option value="all" class="svelte-13d2amd" data-svelte-h="svelte-17kx9r0">all</option><option value="novel" class="svelte-13d2amd" data-svelte-h="svelte-1b0nx1q">novel</option><option value="essay" class="svelte-13d2amd" data-svelte-h="svelte-1tyk0bc">essay</option><option value="poem" class="svelte-13d2amd" data-svelte-h="svelte-10ic8n2">poem</option><option value="other" class="svelte-13d2amd" data-svelte-h="svelte-2jatou">other</option></select></div> <div class="svelte-13d2amd">${posts.length == 0 ? `${validate_component(Loading, "Loading").$$render($$result, {}, {}, {})}` : ``} ${each(visiblePosts, (post) => {
    return `${validate_component(PostCard, "PostCard").$$render($$result, { postData: post }, {}, {})}`;
  })} </div>`;
});
export {
  Page as default
};
