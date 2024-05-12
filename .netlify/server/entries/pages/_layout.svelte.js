import { c as create_ssr_component, a as add_attribute, e as escape, v as validate_component } from "../../chunks/ssr.js";
import { N as Notifications } from "../../chunks/Notifications.js";
import "@tadashi/hex-id";
import "../../chunks/Notifications.svelte_svelte_type_style_lang.js";
import { i as isAdmin } from "../../chunks/isAdmin.js";
import "../../chunks/client.js";
import "../../chunks/pageModule.js";
const footer = "/_app/immutable/assets/footer.Bm62diV9.png";
const css$3 = {
  code: "#container.svelte-ep6kyd{display:flex;background-color:#2b2b2b;width:100%;height:200px;color:white;font-size:20px;text-align:center;justify-content:center;align-items:center}#text.svelte-ep6kyd{display:flex}img.svelte-ep6kyd{height:100%}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div id="container" class="svelte-ep6kyd" data-svelte-h="svelte-2yo3jv"><div id="text" class="svelte-ep6kyd">friend of despair</div> <img${add_attribute("src", footer, 0)} alt="" class="svelte-ep6kyd"> </div>`;
});
const css$2 = {
  code: '@import url("https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap");#main.svelte-14qal3y{display:flex;width:100%}#inner.svelte-14qal3y{margin:5px;padding:10px;width:100%;height:100%;border-color:#2b2b2b;border-width:2px;border-radius:5px;border-style:solid;color:#2b2b2b;font-size:20px;font-family:"Poetsen One", sans-serif;font-weight:400;font-style:normal;position:relative;z-index:1}#inner.svelte-14qal3y:after{content:"";position:absolute;bottom:0;left:0;width:100%;height:100%;background-color:#fff;z-index:-2}#inner.svelte-14qal3y:before{content:"";position:absolute;bottom:0;left:0;width:0%;height:100%;background-color:#2b2b2b;transition:all 0.3s;z-index:-1}#inner.svelte-14qal3y:hover{color:#fff}#inner.svelte-14qal3y:hover:before{width:100%}',
  map: null
};
const Move = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { to = "/" } = $$props;
  let { name = "main" } = $$props;
  if ($$props.to === void 0 && $$bindings.to && to !== void 0)
    $$bindings.to(to);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  $$result.css.add(css$2);
  return `<div id="main" class="svelte-14qal3y"><button id="inner" class="svelte-14qal3y">${escape(name)}</button> </div>`;
});
const css$1 = {
  code: "header.svelte-168drjh{display:flex;justify-content:space-between;flex-direction:column;justify-content:center;align-items:center;background-color:#ebe5df;padding:10px;position:fixed;height:100vh;width:200px;margin:0;padding:0;top:0;left:0}#moveSector.svelte-168drjh{width:100%;margin-bottom:10px;margin-top:10px}#text.svelte-168drjh{font-size:30px;font-weight:bold}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let adminable = false;
  isAdmin.subscribe((value) => {
    adminable = value;
  });
  $$result.css.add(css$1);
  return `<header class="svelte-168drjh"><div id="text" class="svelte-168drjh" data-svelte-h="svelte-gc61sg">catea</div> <div id="moveSector" class="svelte-168drjh">${validate_component(Move, "Move").$$render($$result, { to: "/", name: "main" }, {}, {})} ${validate_component(Move, "Move").$$render($$result, { to: "/posts/", name: "posts" }, {}, {})} ${validate_component(Move, "Move").$$render($$result, { to: "/contact/", name: "contact" }, {}, {})} ${validate_component(Move, "Move").$$render($$result, { to: "/admin/", name: "admin" }, {}, {})}  ${adminable ? `${validate_component(Move, "Move").$$render($$result, { to: "/new/", name: "new" }, {}, {})}` : ``}</div> </header>`;
});
const css = {
  code: "main.svelte-q9cqld{display:block;margin-left:200px}#article.svelte-q9cqld{margin:10px;min-height:calc(100vh - 200px)}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-q9cqld"><div id="article" class="svelte-q9cqld">${slots.default ? slots.default({}) : ``}</div> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</main> ${validate_component(Notifications, "Notifications").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Layout as default
};
