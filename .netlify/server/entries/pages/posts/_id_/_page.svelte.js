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
  code: "@media(max-width: 767px){#overview.svelte-horzm6.svelte-horzm6{display:none}#articleWapper.svelte-horzm6.svelte-horzm6{margin-right:20px;margin-left:20px;width:calc(100% - 40px)}#title.svelte-horzm6.svelte-horzm6{flex-direction:column;align-items:center;text-align:center}}#articleWapper.svelte-horzm6 p{margin-bottom:10px}#articleWapper.svelte-horzm6 strong{background-color:rgb(87, 81, 74);color:#f6f2ee}:root{scroll-behavior:smooth}#title.svelte-horzm6.svelte-horzm6{margin:-10px;margin-bottom:10px;background-color:#57514a;color:white;font-size:40px;padding:10px;font-weight:bold;display:flex;text-align:center}#title.svelte-horzm6 #titleDate.svelte-horzm6{display:flex;font-size:20px;font-weight:normal;align-items:center}#articleWapper.svelte-horzm6.svelte-horzm6{margin-right:220px;margin-left:20px}#overview.svelte-horzm6.svelte-horzm6{position:fixed;top:50%;right:0;width:200px;padding:10px;color:#57514a}#overview.svelte-horzm6 ul.svelte-horzm6{list-style-type:none;padding:0}#overview.svelte-horzm6 li.svelte-horzm6{margin-bottom:10px}#overview.svelte-horzm6 a.svelte-horzm6{color:#57514a;text-decoration:none}",
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
