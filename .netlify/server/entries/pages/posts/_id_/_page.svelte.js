import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { i as isAdmin } from "../../../../chunks/isAdmin.js";
import "../../../../chunks/pageModule.js";
import "../../../../chunks/firebase.js";
import "../../../../chunks/client.js";
import { C as Carta } from "../../../../chunks/carta.js";
const css$1 = {
  code: ".loading.svelte-1074lho{display:flex;justify-content:center;align-items:center;height:100vh;position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;background-color:#f6f2ee}.loading__spinner.svelte-1074lho{width:50px;height:50px;border-top:5px solid rgb(87, 81, 74);border-radius:50%;animation:svelte-1074lho-spin 1s linear infinite}@keyframes svelte-1074lho-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  map: null
};
const Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return ` <div class="loading svelte-1074lho" data-svelte-h="svelte-1o358oz"><div class="loading__spinner svelte-1074lho"></div> </div>`;
});
const css = {
  code: "@media(max-width: 767px){#overview.svelte-iw9jbq.svelte-iw9jbq{display:none}#articleWapper.svelte-iw9jbq.svelte-iw9jbq{margin-right:20px;margin-left:20px;width:calc(100% - 40px)}#title.svelte-iw9jbq.svelte-iw9jbq{flex-direction:column;align-items:center;text-align:center}}:root{scroll-behavior:smooth}#title.svelte-iw9jbq.svelte-iw9jbq{margin-left:20px;margin-bottom:10px;font-size:40px;padding:10px;font-weight:bold;display:flex;flex-direction:column}#title.svelte-iw9jbq #titleDate.svelte-iw9jbq{display:flex;font-size:20px;font-weight:normal}#articleWapper.svelte-iw9jbq.svelte-iw9jbq{margin-right:220px;margin-left:20px}#overview.svelte-iw9jbq.svelte-iw9jbq{position:fixed;z-index:100;transform:translate(0, -50%);top:50%;right:0;width:200px;padding:10px;color:#57514a}#overview.svelte-iw9jbq ul.svelte-iw9jbq{list-style-type:none;padding:0}#overview.svelte-iw9jbq li.svelte-iw9jbq{margin-bottom:10px}#overview.svelte-iw9jbq a.svelte-iw9jbq{color:#57514a;text-decoration:none;background-color:transparent;padding:0;margin:0;transition:0;box-shadow:0px 0px 0 rgba(50, 49, 47, 0.654);text-align:left}#overview.svelte-iw9jbq a.svelte-iw9jbq:hover{background-color:rgb(87, 81, 74);color:white;transform:translate(0, 0)}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  new Carta({ sanitizer: false });
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
