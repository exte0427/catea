import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { T as Take } from "../../../chunks/Take.js";
const css = {
  code: "p.svelte-11gunx{font-size:20px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<h1 data-svelte-h="svelte-suv2py">contact</h1> <p class="svelte-11gunx" data-svelte-h="svelte-9pz9lo">hi! im catea<br>
    if you are interested in my work, feel free to contact to me!</p> <ul data-svelte-h="svelte-nrhgan"><li>feedback about my art</li> <li>request</li> <li>fun story about your life</li></ul> <p class="svelte-11gunx" data-svelte-h="svelte-1yf7xd8">anything is welcomed!<br>
    i&#39;ll wait for your message!</p> ${validate_component(Take, "Take").$$render($$result, { link: "https://twitter.com/drawcatea" }, {}, {
    default: () => {
      return `contact me via twitter(X)`;
    }
  })}`;
});
export {
  Page as default
};
