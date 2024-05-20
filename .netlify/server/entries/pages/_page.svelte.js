import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
import "../../chunks/firebase.js";
import { T as Take } from "../../chunks/Take.js";
const Welcome = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div><h1 data-svelte-h="svelte-12he2ao">Im Catea</h1> <p data-svelte-h="svelte-h4qifi">i draw and do shitty stuff</p> <h1 data-svelte-h="svelte-zq3g5o">check out my works</h1> <h2 data-svelte-h="svelte-1e6fnyh">drawings</h2> ${validate_component(Take, "Take").$$render($$result, { link: "https://twitter.com/drawcatea" }, {}, {
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
  )} <blockquote data-svelte-h="svelte-18kewpj">writings are not yet!</blockquote></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-t32ptj_START -->${$$result.title = `<title>Home</title>`, ""}<meta name="description" content="Svelte demo app"><!-- HEAD_svelte-t32ptj_END -->`, ""} <section>${validate_component(Welcome, "Welcome").$$render($$result, {}, {}, {})} </section>`;
});
export {
  Page as default
};
