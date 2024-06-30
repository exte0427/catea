import { c as create_ssr_component, e as escape, a as add_attribute, d as each, v as validate_component } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
import { P as PageModule } from "../../../chunks/pageModule.js";
import "../../../chunks/firebase.js";
const css$1 = {
  code: "#inner.svelte-1763nab{border-width:0px;width:100%;background-color:rgb(87, 81, 74);margin:10px;margin-bottom:0;padding:10px;cursor:pointer;box-shadow:5px 5px 0 rgba(50, 49, 47, 0.654);color:white;border-radius:5px}#title.svelte-1763nab{font-size:1.5em}#category.svelte-1763nab{background-color:white;color:rgb(87, 81, 74);padding:2px;border-radius:5px}",
  map: null
};
const PostCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { postData } = $$props;
  if ($$props.postData === void 0 && $$bindings.postData && postData !== void 0)
    $$bindings.postData(postData);
  $$result.css.add(css$1);
  return `<button id="inner" class="svelte-1763nab"><strong id="title" class="svelte-1763nab">${escape(postData.title)}</strong> <p>${escape(PageModule.getDate(postData.date))} <strong id="category" class="svelte-1763nab">${escape(postData.category)}</strong></p> </button>`;
});
const css = {
  code: "@media(max-width: 767px){#searchDiv.svelte-1d6czs2.svelte-1d6czs2{flex-direction:column;align-items:center}#searchDiv.svelte-1d6czs2 .svelte-1d6czs2:first-child{margin-bottom:10px}#searchDiv.svelte-1d6czs2 #category.svelte-1d6czs2{width:80%;margin-left:0}}#searchDiv.svelte-1d6czs2.svelte-1d6czs2{display:flex;justify-content:center;margin:-10px;background-color:rgb(87, 81, 74);margin:-10px -10px 0 -10px;padding:20px}#searchQuery.svelte-1d6czs2.svelte-1d6czs2{width:80%;height:30px;border:0;border-radius:5px;padding:5px;box-shadow:5px 5px 0px rgba(50, 49, 47, 0.654)}#category.svelte-1d6czs2.svelte-1d6czs2{height:40px;margin-left:10px;border:0;border-radius:5px;padding:5px;box-shadow:5px 5px 0px rgba(50, 49, 47, 0.654)}input.svelte-1d6czs2.svelte-1d6czs2:focus{outline:none}select.svelte-1d6czs2.svelte-1d6czs2:focus{outline:none}div.svelte-1d6czs2.svelte-1d6czs2{display:flex;flex-wrap:wrap;justify-content:center}",
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
  return `<div id="searchDiv" class="svelte-1d6czs2"><input type="text" name="searchQuery" id="searchQuery" autocomplete="off" class="svelte-1d6czs2"${add_attribute("value", searchQuery, 0)}>  <select name="category" id="category" class="svelte-1d6czs2"><option value="all" class="svelte-1d6czs2" data-svelte-h="svelte-17kx9r0">all</option><option value="novel" class="svelte-1d6czs2" data-svelte-h="svelte-1b0nx1q">novel</option><option value="essay" class="svelte-1d6czs2" data-svelte-h="svelte-1tyk0bc">essay</option><option value="poem" class="svelte-1d6czs2" data-svelte-h="svelte-10ic8n2">poem</option><option value="other" class="svelte-1d6czs2" data-svelte-h="svelte-2jatou">other</option></select></div> <div class="svelte-1d6czs2">${each(visiblePosts, (post) => {
    return `${validate_component(PostCard, "PostCard").$$render($$result, { postData: post }, {}, {})}`;
  })} </div>`;
});
export {
  Page as default
};
