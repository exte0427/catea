import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { i as isAdmin } from "../../../../chunks/isAdmin.js";
import "../../../../chunks/pageModule.js";
import "../../../../chunks/firebase.js";
import "../../../../chunks/client.js";
import { L as Loading } from "../../../../chunks/Loading.js";
import { C as Carta } from "../../../../chunks/carta.js";
/* empty css                                                          */
const css = {
  code: "@media(max-width: 767px){#overview.svelte-80jmiz.svelte-80jmiz{display:none}#articleWapper.svelte-80jmiz.svelte-80jmiz{margin-right:20px;margin-left:20px;width:calc(100% - 40px)}#title.svelte-80jmiz.svelte-80jmiz{flex-direction:column;align-items:center;text-align:center}}:root{scroll-behavior:smooth}#title.svelte-80jmiz.svelte-80jmiz{margin-left:20px;margin-bottom:10px;font-size:40px;padding:10px;font-weight:bold;display:flex;flex-direction:column}#title.svelte-80jmiz #titleDate.svelte-80jmiz{display:flex;font-size:20px;font-weight:normal}#articleWapper.svelte-80jmiz.svelte-80jmiz{margin-right:220px;margin-left:20px}#afterArticleWapper.svelte-80jmiz.svelte-80jmiz{flex-grow:1}.poem#title.svelte-80jmiz.svelte-80jmiz{text-align:center}.poem#title.svelte-80jmiz #titleDate.svelte-80jmiz{justify-content:center}.poem#articleWapper.svelte-80jmiz.svelte-80jmiz{text-align:center;margin-right:20px}.poem#overview.svelte-80jmiz.svelte-80jmiz{display:none}#overview.svelte-80jmiz.svelte-80jmiz{position:fixed;z-index:100;transform:translate(0, -50%);top:50%;right:0;width:200px;padding:10px;color:#57514a}#overview.svelte-80jmiz ul.svelte-80jmiz{list-style-type:none;padding:0}#overview.svelte-80jmiz li.svelte-80jmiz{margin-bottom:10px}#overview.svelte-80jmiz a.svelte-80jmiz{color:#57514a;text-decoration:none;background-color:transparent;padding:0;margin:0;transition:0;box-shadow:0px 0px 0 rgba(50, 49, 47, 0.654);text-align:left}#overview.svelte-80jmiz a.svelte-80jmiz:hover{background-color:rgb(87, 81, 74);color:white;transform:translate(0, 0)}",
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
