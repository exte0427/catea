import { c as create_ssr_component } from "./ssr.js";
const css = {
  code: ".loading.svelte-1074lho{display:flex;justify-content:center;align-items:center;height:100vh;position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;background-color:#f6f2ee}.loading__spinner.svelte-1074lho{width:50px;height:50px;border-top:5px solid rgb(87, 81, 74);border-radius:50%;animation:svelte-1074lho-spin 1s linear infinite}@keyframes svelte-1074lho-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  map: null
};
const Loading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return ` <div class="loading svelte-1074lho" data-svelte-h="svelte-1o358oz"><div class="loading__spinner svelte-1074lho"></div> </div>`;
});
export {
  Loading as L
};
