import { c as create_ssr_component, a as add_attribute, b as subscribe, e as escape, v as validate_component } from "../../chunks/ssr.js";
/* empty css                                                  */
import "../../chunks/client.js";
import { i as isAdmin } from "../../chunks/isAdmin.js";
import { p as page } from "../../chunks/stores.js";
import "../../chunks/pageModule.js";
const css$4 = {
  code: "@media(max-width: 767px){#container.svelte-kdd1j3.svelte-kdd1j3{text-align:center;justify-content:center}}#container.svelte-kdd1j3.svelte-kdd1j3{height:200px}#container.svelte-kdd1j3 #realContainer.svelte-kdd1j3{background-color:rgb(87, 81, 74);width:100%;height:100%}.waves.svelte-kdd1j3.svelte-kdd1j3{position:relative;width:100%;height:15vh;margin-bottom:-7px;min-height:100px;max-height:150px}.parallax.svelte-kdd1j3>use.svelte-kdd1j3{animation:svelte-kdd1j3-move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite}.parallax.svelte-kdd1j3>use.svelte-kdd1j3:nth-child(1){animation-delay:-2s;animation-duration:7s}.parallax.svelte-kdd1j3>use.svelte-kdd1j3:nth-child(2){animation-delay:-3s;animation-duration:10s}.parallax.svelte-kdd1j3>use.svelte-kdd1j3:nth-child(3){animation-delay:-4s;animation-duration:13s}.parallax.svelte-kdd1j3>use.svelte-kdd1j3:nth-child(4){animation-delay:-5s;animation-duration:20s}@keyframes svelte-kdd1j3-move-forever{0%{transform:translate3d(-90px, 0, 0)}100%{transform:translate3d(85px, 0, 0)}}@media(max-width: 768px){.waves.svelte-kdd1j3.svelte-kdd1j3{height:40px;min-height:40px}}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<div id="container" class="svelte-kdd1j3" data-svelte-h="svelte-ufw6ao"><svg class="waves svelte-kdd1j3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto"><defs><path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path></defs><g class="parallax svelte-kdd1j3"><use xlink:href="#gentle-wave" x="48" y="0" fill="rgb(87, 81, 74,0.7)" class="svelte-kdd1j3"></use><use xlink:href="#gentle-wave" x="48" y="3" fill="rgb(87, 81, 74,0.5)" class="svelte-kdd1j3"></use><use xlink:href="#gentle-wave" x="48" y="7" fill="rgb(87, 81, 74,1)" class="svelte-kdd1j3"></use></g></svg> <div id="realContainer" class="svelte-kdd1j3"></div> </div>`;
});
const cateaImg_static = "/_app/immutable/assets/cateaMoving.C1SeJXLn.png";
const catea_Img_dynamic = "/_app/immutable/assets/cateaMoving.CdPXfbCU.gif";
const css$3 = {
  code: "#img.svelte-2mwn26{position:absolute;bottom:0;display:flex;align-items:center;justify-items:center;text-align:center  ;justify-content:center}#cateaImg.svelte-2mwn26{width:80%;mix-blend-mode:multiply;border-radius:0;border:0;padding:0;margin:0}",
  map: null
};
const CateaImg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cateaImg = cateaImg_static;
  const change = () => {
    if (Math.random() > 0.5)
      cateaImg = catea_Img_dynamic;
    else
      cateaImg = cateaImg_static;
    setTimeout(change, 1e3);
  };
  change();
  $$result.css.add(css$3);
  return `<div id="img" class="svelte-2mwn26"><img${add_attribute("src", cateaImg, 0)} alt="" id="cateaImg" class="svelte-2mwn26"> </div>`;
});
const css$2 = {
  code: '@import url("https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap");#main.svelte-87kabs{display:flex;flex-direction:column;width:100%}#subContainer.svelte-87kabs{display:block}.inner.svelte-87kabs{padding:10px;width:100%;height:100%;border:0;background-color:transparent;color:#2b2b2b;font-size:20px;font-family:"Poetsen One", sans-serif;font-weight:400;font-style:normal;position:relative;z-index:1}.inner.svelte-87kabs:after{content:"";position:absolute;bottom:0;left:0;width:100%;height:100%;z-index:-2}.inner.svelte-87kabs:before{content:"";position:absolute;bottom:0;left:0;width:0%;height:100%;background-color:#2b2b2b;transition:all 0.3s;z-index:-1}.inner__selected.svelte-87kabs{color:#fff}.inner__selected.svelte-87kabs:before{width:100%}',
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
  return `<div id="main" class="svelte-87kabs"><button class="${["inner svelte-87kabs", triggered ? "inner__selected" : ""].join(" ").trim()}">${escape(name)} ${originTriggered == true ? `<div id="subContainer" class="svelte-87kabs">${slots.default ? slots.default({}) : ``}</div>` : ``}</button> </div>`;
});
const css$1 = {
  code: "@media(max-width: 767px){header.svelte-kgpqto{width:100%}ul.svelte-kgpqto{text-align:center}li.svelte-kgpqto{display:inline-block}#imgContainer.svelte-kgpqto{display:none}}@media(min-width: 768px){header.svelte-kgpqto{position:fixed;height:100vh;width:200px;top:0;left:0}}#imgContainer.svelte-kgpqto{width:100%}header.svelte-kgpqto{display:flex;justify-content:space-between;flex-direction:column;justify-content:center;align-items:center;background-color:#ebe5df;padding:10px;margin:0;padding:0}#moveSector.svelte-kgpqto{width:100%;margin-bottom:10px;margin-top:10px}#text.svelte-kgpqto{font-size:30px;font-weight:bold}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let adminable = false;
  isAdmin.subscribe((value) => {
    adminable = value;
  });
  $$result.css.add(css$1);
  return `<header class="svelte-kgpqto"><div id="text" class="svelte-kgpqto" data-svelte-h="svelte-gc61sg">catea</div> <div id="moveSector" class="svelte-kgpqto"><ul class="svelte-kgpqto"><li class="svelte-kgpqto">${validate_component(Move, "Move").$$render($$result, { to: "/", name: "main" }, {}, {})}</li> <li class="svelte-kgpqto">${validate_component(Move, "Move").$$render($$result, { to: "/posts/", name: "posts" }, {}, {})}</li> <li class="svelte-kgpqto">${validate_component(Move, "Move").$$render($$result, { to: "/contact/", name: "contact" }, {}, {})}</li> <li class="svelte-kgpqto">${validate_component(Move, "Move").$$render($$result, { to: "/admin/", name: "admin" }, {}, {})}</li></ul>  ${adminable ? `${validate_component(Move, "Move").$$render($$result, { to: "/new/", name: "new" }, {}, {})}` : ``}</div> <div id="imgContainer" class="svelte-kgpqto">${validate_component(CateaImg, "CateaImg").$$render($$result, {}, {}, {})}</div> </header>`;
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
