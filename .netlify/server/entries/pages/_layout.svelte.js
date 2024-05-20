import { c as create_ssr_component, a as add_attribute, b as subscribe, e as escape, v as validate_component } from "../../chunks/ssr.js";
import { i as isAdmin } from "../../chunks/isAdmin.js";
import "../../chunks/client.js";
import { p as page } from "../../chunks/stores.js";
import "../../chunks/pageModule.js";
const footer = "/_app/immutable/assets/footer.Bm62diV9.png";
const css$3 = {
  code: "@media(max-width: 767px){#container.svelte-1lhqo4d{text-align:center;justify-content:center}#text.svelte-1lhqo4d{position:absolute}}#container.svelte-1lhqo4d{display:flex;background-color:#2b2b2b;width:100%;height:200px;min-height:200px;color:white;font-size:20px;text-align:center;justify-content:center;align-items:center;overflow:hidden}#text.svelte-1lhqo4d{display:flex}img.svelte-1lhqo4d{height:100%}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div id="container" class="svelte-1lhqo4d" data-svelte-h="svelte-2yo3jv"><div id="text" class="svelte-1lhqo4d">friend of despair</div> <img${add_attribute("src", footer, 0)} alt="" class="svelte-1lhqo4d"> </div>`;
});
const css$2 = {
  code: '@import url("https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap");#main.svelte-m7fr8g{display:flex;width:100%}.inner.svelte-m7fr8g{padding:10px;width:100%;height:100%;border:0;background-color:transparent;color:#2b2b2b;font-size:20px;font-family:"Poetsen One", sans-serif;font-weight:400;font-style:normal;position:relative;z-index:1}.inner.svelte-m7fr8g:after{content:"";position:absolute;bottom:0;left:0;width:100%;height:100%;z-index:-2}.inner.svelte-m7fr8g:before{content:"";position:absolute;bottom:0;left:0;width:0%;height:100%;background-color:#2b2b2b;transition:all 0.3s;z-index:-1}.inner__selected.svelte-m7fr8g{color:#fff}.inner__selected.svelte-m7fr8g:before{width:100%}',
  map: null
};
const Move = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { to = "/" } = $$props;
  let { name = "main" } = $$props;
  let originTriggered = false;
  let triggered = false;
  if ($$props.to === void 0 && $$bindings.to && to !== void 0)
    $$bindings.to(to);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  $$result.css.add(css$2);
  originTriggered = $page.url.pathname.split("/")[1] === to.split("/")[1];
  triggered = originTriggered;
  $$unsubscribe_page();
  return `<div id="main" class="svelte-m7fr8g"><button class="${["inner svelte-m7fr8g", triggered ? "inner__selected" : ""].join(" ").trim()}">${escape(name)}</button> </div>`;
});
const css$1 = {
  code: "@media(max-width: 767px){header.svelte-mhfhg{width:100%}ul.svelte-mhfhg{text-align:center}li.svelte-mhfhg{display:inline-block}}@media(min-width: 768px){header.svelte-mhfhg{position:fixed;height:100vh;width:200px;top:0;left:0}}header.svelte-mhfhg{display:flex;justify-content:space-between;flex-direction:column;justify-content:center;align-items:center;background-color:#ebe5df;padding:10px;margin:0;padding:0}#moveSector.svelte-mhfhg{width:100%;margin-bottom:10px;margin-top:10px}#text.svelte-mhfhg{font-size:30px;font-weight:bold}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let adminable = false;
  isAdmin.subscribe((value) => {
    adminable = value;
  });
  $$result.css.add(css$1);
  return `<header class="svelte-mhfhg"><div id="text" class="svelte-mhfhg" data-svelte-h="svelte-gc61sg">catea</div> <div id="moveSector" class="svelte-mhfhg"><ul class="svelte-mhfhg"><li class="svelte-mhfhg">${validate_component(Move, "Move").$$render($$result, { to: "/", name: "main" }, {}, {})}</li> <li class="svelte-mhfhg">${validate_component(Move, "Move").$$render($$result, { to: "/posts/", name: "posts" }, {}, {})}</li> <li class="svelte-mhfhg">${validate_component(Move, "Move").$$render($$result, { to: "/contact/", name: "contact" }, {}, {})}</li> <li class="svelte-mhfhg">${validate_component(Move, "Move").$$render($$result, { to: "/admin/", name: "admin" }, {}, {})}</li></ul>  ${adminable ? `${validate_component(Move, "Move").$$render($$result, { to: "/new/", name: "new" }, {}, {})}` : ``}</div> </header>`;
});
const css = {
  code: "@media(min-width: 768px){main.svelte-nue92e{margin-left:200px;height:100vh}}@media(max-width: 767px){main.svelte-nue92e{height:calc(100vh - 100px)}}main.svelte-nue92e{display:flex;flex-direction:column}#article.svelte-nue92e{margin:10px;flex:1}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-nue92e"><div id="article" class="svelte-nue92e">${slots.default ? slots.default({}) : ``}</div> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</main> </div>`;
});
export {
  Layout as default
};
