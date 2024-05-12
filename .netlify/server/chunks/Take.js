import { c as create_ssr_component, a as add_attribute } from "./ssr.js";
const css = {
  code: "a.svelte-ifmei3{text-decoration:none;color:#2b2b2b;background-color:#fff;display:block;padding:10px;margin:5px;border-radius:5px;border-width:2px;border-color:#2b2b2b;text-align:center;font-size:20px}",
  map: null
};
const Take = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { link = "/" } = $$props;
  if ($$props.link === void 0 && $$bindings.link && link !== void 0)
    $$bindings.link(link);
  $$result.css.add(css);
  return `<a${add_attribute("href", link, 0)} target="_blank" class="svelte-ifmei3">${slots.default ? slots.default({}) : ``} </a>`;
});
export {
  Take as T
};
