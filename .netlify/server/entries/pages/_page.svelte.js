import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
import "../../chunks/firebase.js";
import { T as Take } from "../../chunks/Take.js";
const css = {
  code: "#imgDiv.svelte-p09joh.svelte-p09joh{width:100%;height:400px;overflow:hidden;margin:-10px;width:calc(100% + 20px);padding:0;position:relative}#imgDiv.svelte-p09joh #mainText.svelte-p09joh{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);text-align:center;color:white;font-size:2em;font-weight:bold}img.svelte-p09joh.svelte-p09joh{position:relative;border:0;border-radius:0;width:100%;margin:0px;top:-50%;filter:brightness(20%)}#worksContainer.svelte-p09joh.svelte-p09joh{margin-top:50px}",
  map: null
};
const Welcome = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div><div id="imgDiv" class="svelte-p09joh" data-svelte-h="svelte-8785ij"><img src="https://pbs.twimg.com/media/GPED0RrbsAA29Qm?format=jpg&name=4096x4096" alt="" class="svelte-p09joh"> <div id="mainText" class="svelte-p09joh"><div id="mainCa">Im Catea</div> <div id="subCa">i work to resonate someone</div></div></div> <div id="worksContainer" class="svelte-p09joh"><h2 data-svelte-h="svelte-1e6fnyh">drawings</h2> ${validate_component(Take, "Take").$$render($$result, { link: "https://twitter.com/drawcatea" }, {}, {
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
  )} <blockquote data-svelte-h="svelte-18kewpj">writings are not yet!</blockquote></div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-t32ptj_START -->${$$result.title = `<title>Home</title>`, ""}<meta name="description" content="Svelte demo app"><!-- HEAD_svelte-t32ptj_END -->`, ""} <section>${validate_component(Welcome, "Welcome").$$render($$result, {}, {}, {})} </section>`;
});
export {
  Page as default
};
