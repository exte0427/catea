import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { i as isAdmin } from "../../../../chunks/isAdmin.js";
import "../../../../chunks/pageModule.js";
import "../../../../chunks/firebase.js";
import "../../../../chunks/client.js";
const css$1 = {
  code: ".loading.svelte-1074lho{display:flex;justify-content:center;align-items:center;height:100vh;position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;background-color:#f6f2ee}.loading__spinner.svelte-1074lho{width:50px;height:50px;border-top:5px solid rgb(87, 81, 74);border-radius:50%;animation:svelte-1074lho-spin 1s linear infinite}@keyframes svelte-1074lho-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  map: null
};
const Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return ` <div class="loading svelte-1074lho" data-svelte-h="svelte-1o358oz"><div class="loading__spinner svelte-1074lho"></div> </div>`;
});
const css = {
  code: "#title.svelte-1w2kaor.svelte-1w2kaor{margin:-10px;margin-bottom:10px;background-color:#57514a;color:white;font-size:40px;padding:10px;font-weight:bold;display:flex;text-align:center}#title.svelte-1w2kaor #titleDate.svelte-1w2kaor{display:flex;font-size:20px;font-weight:normal;align-items:center}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  isAdmin.subscribe((value) => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${`${validate_component(Loading, "Loading").$$render($$result, {}, {}, {})}`}`;
});
export {
  Page as default
};
