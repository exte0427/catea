import { c as create_ssr_component, a as add_attribute, v as validate_component } from "../../chunks/ssr.js";
/* empty css                                                  */
import "../../chunks/firebase.js";
/* empty css                                                    */
const css$1 = {
  code: "a.svelte-1kh945b{text-decoration:none;color:white;background-color:rgb(87, 81, 74);display:block;padding:10px;margin:5px;margin-bottom:10px;border-radius:5px;border-width:2px;border-color:#2b2b2b;text-align:center;font-size:20px;font-weight:bold;box-shadow:5px 5px 0 rgba(50, 49, 47, 0.654);transition:0.3s}a.svelte-1kh945b:hover{box-shadow:0px 0px 0 rgba(50, 49, 47, 0.654);transform:translate(5px, 5px)}",
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
  $$result.css.add(css$1);
  return `<a${add_attribute("href", link, 0)}${add_attribute("target", targetData, 0)} class="svelte-1kh945b">${slots.default ? slots.default({}) : ``} </a>`;
});
const mainImg = "/_app/immutable/assets/catea1.CxIxFKFD.png";
const css = {
  code: "#imgDiv.svelte-q0uxvk.svelte-q0uxvk{width:100%;height:400px;overflow:hidden;margin:-10px;width:calc(100% + 20px);padding:0;position:relative;display:flex;justify-content:right}#imgDiv.svelte-q0uxvk #mainText.svelte-q0uxvk{position:absolute;top:50%;left:0;text-align:left;color:white;font-size:2em;font-weight:bold;margin-left:40px;color:rgb(87, 81, 74)}#imgDiv.svelte-q0uxvk img.svelte-q0uxvk{height:400px;width:auto;margin:0;padding:0;border-radius:0}#worksContainer.svelte-q0uxvk.svelte-q0uxvk{margin-top:50px}@media(max-width: 767px){#imgDiv.svelte-q0uxvk.svelte-q0uxvk{display:none}#mainText.svelte-q0uxvk.svelte-q0uxvk{text-align:center;font-size:1.5em;font-weight:bold;color:rgb(87, 81, 74)}}@media(min-width: 768px){#imgForMobile.svelte-q0uxvk.svelte-q0uxvk{display:none}}",
  map: null
};
const Welcome = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div><div id="imgDiv" class="svelte-q0uxvk" data-svelte-h="svelte-1to3kg9"><img${add_attribute("src", mainImg, 0)} alt="" class="svelte-q0uxvk"> <div id="mainText" class="svelte-q0uxvk">Im Catea<br>
            i work to resonate someone</div></div> <div id="imgForMobile" class="svelte-q0uxvk" data-svelte-h="svelte-bv9333"><img${add_attribute("src", mainImg, 0)} alt=""> <div id="mainText" class="svelte-q0uxvk">Im Catea<br>
            i work to resonate someone</div></div> <div id="worksContainer" class="svelte-q0uxvk"><h2 data-svelte-h="svelte-1e6fnyh">drawings</h2> ${validate_component(Take, "Take").$$render($$result, { link: "https://twitter.com/drawcatea" }, {}, {
    default: () => {
      return `twitter(X)`;
    }
  })} ${validate_component(Take, "Take").$$render($$result, { link: "https://twitter.com/drawcatea" }, {}, {
    default: () => {
      return `pixiv`;
    }
  })} <h2 data-svelte-h="svelte-7wvduh">development</h2> ${validate_component(Take, "Take").$$render($$result, { link: "https://itch.io/dashboard" }, {}, {
    default: () => {
      return `itch.io`;
    }
  })} ${validate_component(Take, "Take").$$render($$result, { link: "https://github.com/exte0427" }, {}, {
    default: () => {
      return `github`;
    }
  })} <h2 data-svelte-h="svelte-75a1xy">writings &amp; video</h2> ${validate_component(Take, "Take").$$render(
    $$result,
    {
      link: "https://www.youtube.com/channel/UCdywJSqTF7KGs-CWgen1qHA"
    },
    {},
    {
      default: () => {
        return `youtube`;
      }
    }
  )} ${validate_component(Take, "Take").$$render($$result, { link: "/posts", newTab: false }, {}, {
    default: () => {
      return `posts`;
    }
  })}</div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-t32ptj_START -->${$$result.title = `<title>Home</title>`, ""}<meta name="description" content="Svelte demo app"><!-- HEAD_svelte-t32ptj_END -->`, ""} <section>${validate_component(Welcome, "Welcome").$$render($$result, {}, {}, {})} </section>`;
});
export {
  Page as default
};
