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
  code: '#main.svelte-10d27cr{display:flex;flex-direction:column;width:100%}#subContainer.svelte-10d27cr{display:block}.inner.svelte-10d27cr{padding:10px;width:100%;height:100%;border:0;background-color:transparent;color:#57514a;font-size:20px;font-family:"Jua", sans-serif;position:relative;z-index:1}.inner.svelte-10d27cr:after{content:"";position:absolute;bottom:0;left:0;width:100%;height:100%;z-index:-2}.inner.svelte-10d27cr:before{content:"";position:absolute;bottom:0;left:0;width:0%;height:100%;background-color:#57514a;transition:all 0.3s;z-index:-1}.inner__selected.svelte-10d27cr{color:#fff}.inner__selected.svelte-10d27cr:before{width:100%}',
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
  {
    {
      const path = $page.url.pathname.split("/").slice(1).filter((e) => e !== "");
      const toPath = to.split("/").slice(1, -1).filter((e) => e !== "");
      originTriggered = true;
      if (path.length != toPath.length)
        originTriggered = false;
      else {
        for (let i = 0; i < toPath.length; i++) {
          if (path[i] !== toPath[i]) {
            originTriggered = false;
            break;
          }
        }
      }
    }
  }
  triggered = originTriggered;
  $$unsubscribe_page();
  return `<div id="main" class="svelte-10d27cr"><button class="${["inner svelte-10d27cr", triggered ? "inner__selected" : ""].join(" ").trim()}">${escape(name)} ${originTriggered == true ? `<div id="subContainer" class="svelte-10d27cr">${slots.default ? slots.default({}) : ``}</div>` : ``}</button> </div>`;
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
  return `<header class="svelte-kgpqto"><div id="text" class="svelte-kgpqto" data-svelte-h="svelte-gc61sg">catea</div> <div id="moveSector" class="svelte-kgpqto"><ul class="svelte-kgpqto"><li class="svelte-kgpqto">${validate_component(Move, "Move").$$render($$result, { to: "/", name: "main" }, {}, {})}</li> <li class="svelte-kgpqto">${validate_component(Move, "Move").$$render($$result, { to: "/posts/", name: "posts" }, {}, {})}</li> <li class="svelte-kgpqto">${validate_component(Move, "Move").$$render(
    $$result,
    {
      to: "/posts/0pyNOOKWWrvT0dSJiW5k/",
      name: "contact"
    },
    {},
    {}
  )}</li> <li class="svelte-kgpqto">${validate_component(Move, "Move").$$render($$result, { to: "/admin/", name: "admin" }, {}, {})}</li></ul>  ${adminable ? `${validate_component(Move, "Move").$$render($$result, { to: "/new/", name: "new" }, {}, {})}` : ``}</div> <div id="imgContainer" class="svelte-kgpqto">${validate_component(CateaImg, "CateaImg").$$render($$result, {}, {}, {})}</div> </header>`;
});
const css = {
  code: '@import url("https://fonts.googleapis.com/css2?family=Jua&display=swap");@media(max-width: 767px){}@media(min-width: 768px){}:root{font-family:"Jua", sans-serif;font-weight:400;font-style:normal}.svelte-1lfxpop{margin:0;padding:0}*{color:#57514a}p{margin-bottom:10px}strong{background-color:rgb(87, 81, 74);color:#f6f2ee}h2{margin-top:20px}hr{margin:40px}a{text-decoration:none;color:white;background-color:rgb(87, 81, 74);display:block;padding:10px;margin:5px;margin-bottom:10px;border-radius:5px;border-width:2px;border-color:#2b2b2b;text-align:center;font-size:20px;font-weight:bold;box-shadow:5px 5px 0 rgba(50, 49, 47, 0.654);transition:0.3s}a:hover{box-shadow:0px 0px 0 rgba(50, 49, 47, 0.654);transform:translate(5px, 5px)}.svelte-1lfxpop::-webkit-scrollbar{width:7px}.svelte-1lfxpop::-webkit-scrollbar-track{display:none}.svelte-1lfxpop::-webkit-scrollbar-thumb{background:#57514a;border-radius:0}@media(min-width: 768px){main.svelte-1lfxpop{margin-left:200px;height:100vh}}@media(max-width: 767px){main.svelte-1lfxpop{height:calc(100vh - 100px)}}main.svelte-1lfxpop{display:flex;flex-direction:column}#article.svelte-1lfxpop{margin:10px;flex:1}',
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-1lfxpop">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-1lfxpop"><div id="article" class="svelte-1lfxpop">${slots.default ? slots.default({}) : ``}</div> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</main> </div>`;
});
export {
  Layout as default
};
