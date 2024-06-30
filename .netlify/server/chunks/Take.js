import { c as create_ssr_component, a as add_attribute } from "./ssr.js";
const css = {
  code: "a.svelte-1cjzxex{text-decoration:none;color:white;background-color:rgb(87, 81, 74);display:block;padding:10px;margin:5px;margin-bottom:10px;border-radius:5px;border-width:2px;border-color:#2b2b2b;text-align:center;font-size:20px;font-weight:bold;box-shadow:5px 5px 0 rgba(50, 49, 47, 0.654)}",
  map: null
};
const Take = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { link = "/" } = $$props;
  let { newTab = true } = $$props;
  let targetData = "_self";
  if (newTab)
    targetData = "_blank";
  if ($$props.link === void 0 && $$bindings.link && link !== void 0)
    $$bindings.link(link);
  if ($$props.newTab === void 0 && $$bindings.newTab && newTab !== void 0)
    $$bindings.newTab(newTab);
  $$result.css.add(css);
  return `<a${add_attribute("href", link, 0)}${add_attribute("target", targetData, 0)} class="svelte-1cjzxex">${slots.default ? slots.default({}) : ``} </a>`;
});
export {
  Take as T
};
