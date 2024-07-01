import { c as create_ssr_component, d as createEventDispatcher, a as add_attribute, f as spread, h as escape_attribute_value, i as escape_object, e as escape, j as each, v as validate_component, m as missing_component, b as subscribe } from "../../../chunks/ssr.js";
import { w as writable } from "../../../chunks/index.js";
import "../../../chunks/pageModule.js";
import "../../../chunks/client.js";
import { S as Server } from "../../../chunks/firebase.js";
import { d as debounce, C as Carta } from "../../../chunks/carta.js";
const editedPost = writable(``);
const css$4 = {
  code: ".carta-renderer.svelte-r6n2gn{position:relative;word-wrap:break-word;word-break:break-word}",
  map: null
};
const Renderer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { value } = $$props;
  let { elem } = $$props;
  let renderedHtml = carta.renderSSR(value);
  debounce(
    (value2) => {
      carta.render(value2).then((rendered) => renderedHtml = rendered).then(() => events("render", void 0));
    },
    carta.rendererDebounce ?? 300
  );
  const events = createEventDispatcher();
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0)
    $$bindings.carta(carta);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.elem === void 0 && $$bindings.elem && elem !== void 0)
    $$bindings.elem(elem);
  $$result.css.add(css$4);
  return `  <div class="carta-renderer markdown-body svelte-r6n2gn"${add_attribute("this", elem, 0)}> <!-- HTML_TAG_START -->${renderedHtml}<!-- HTML_TAG_END --> ${``} </div>`;
});
const css$3 = {
  code: ".carta-input.svelte-1cgwxdh{position:relative}.carta-input-wrapper.svelte-1cgwxdh{height:100%;position:relative;font-family:monospace}textarea.svelte-1cgwxdh{position:relative;width:100%;max-width:100%;min-height:100%;overflow-y:hidden;resize:none;padding:0;margin:0;border:0;color:transparent;background:transparent;outline:none;tab-size:4}.carta-highlight.svelte-1cgwxdh{position:absolute;left:0;right:0;top:0;bottom:0;margin:0;user-select:none;height:fit-content;padding:inherit;margin:inherit;word-wrap:break-word;white-space:pre-wrap;word-break:break-word}.carta-highlight .shiki{margin:0;tab-size:4;background-color:transparent !important}.carta-highlight *{font-family:inherit;font-size:inherit;word-wrap:break-word;white-space:pre-wrap;word-break:break-word}#editor-unfocus-suggestion.svelte-1cgwxdh{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}",
  map: null
};
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { value = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { elem } = $$props;
  let { props = {} } = $$props;
  let textarea;
  let highlighElem;
  let highlighted = value;
  const resize = () => {
    return;
  };
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0)
    $$bindings.carta(carta);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.elem === void 0 && $$bindings.elem && elem !== void 0)
    $$bindings.elem(elem);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.resize === void 0 && $$bindings.resize && resize !== void 0)
    $$bindings.resize(resize);
  $$result.css.add(css$3);
  return `  <div role="tooltip" id="editor-unfocus-suggestion" class="svelte-1cgwxdh" data-svelte-h="svelte-167gk2c">Press ESC then TAB to move the focus off the field</div> <div role="textbox" tabindex="-1" class="carta-input svelte-1cgwxdh"${add_attribute("this", elem, 0)}><div class="carta-input-wrapper svelte-1cgwxdh"><div class="carta-highlight carta-font-code svelte-1cgwxdh" tabindex="-1" aria-hidden="true"${add_attribute("this", highlighElem, 0)}><!-- HTML_TAG_START -->${highlighted}<!-- HTML_TAG_END --></div> <textarea${spread(
    [
      { name: "md" },
      { id: "md" },
      { spellcheck: "false" },
      { class: "carta-font-code" },
      { "aria-multiline": "true" },
      {
        "aria-describedby": "editor-unfocus-suggestion"
      },
      { tabindex: "0" },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      escape_object(props)
    ],
    { classes: "svelte-1cgwxdh" }
  )}${add_attribute("this", textarea, 0)}>${escape(value || "")}</textarea></div> ${``} </div>`;
});
const defaultLabels = {
  writeTab: "Write",
  previewTab: "Preview",
  iconsLabels: {}
};
const MenuIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M4 8a2 2 0 1 1-3.999.001A2 2 0 0 1 4 8m6 0a2 2 0 1 1-3.999.001A2 2 0 0 1 10 8m6 0a2 2 0 1 1-3.999.001A2 2 0 0 1 16 8"></path></svg>`;
});
const css$2 = {
  code: ".carta-toolbar.svelte-1c77udu{height:2rem;display:flex;flex-shrink:0;overflow-x:auto;overflow-y:hidden}.carta-toolbar-left.svelte-1c77udu{display:flex;align-items:center;flex-wrap:nowrap;height:100%}.carta-filler.svelte-1c77udu{flex:1}.carta-toolbar-right.svelte-1c77udu{height:100%;display:flex;align-items:center;justify-content:flex-end}.carta-icon.svelte-1c77udu{display:flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;border-radius:3px;cursor:pointer;margin-left:4px}.carta-icon-full.svelte-1c77udu{display:flex;align-items:center;border-radius:3px;cursor:pointer}.carta-icons-menu.svelte-1c77udu{position:absolute;top:100%;right:0;display:flex;flex-direction:column;margin-right:0.5rem;z-index:1}",
  map: null
};
const Toolbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { mode } = $$props;
  let { tab } = $$props;
  let { labels } = $$props;
  let toolbar;
  let iconsContainer;
  let visibleIcons = [...carta.icons];
  let iconsHidden = false;
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0)
    $$bindings.carta(carta);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  if ($$props.tab === void 0 && $$bindings.tab && tab !== void 0)
    $$bindings.tab(tab);
  if ($$props.labels === void 0 && $$bindings.labels && labels !== void 0)
    $$bindings.labels(labels);
  $$result.css.add(css$2);
  iconsHidden = visibleIcons.length !== carta.icons.length;
  return `   <div class="carta-toolbar svelte-1c77udu" role="toolbar"${add_attribute("this", toolbar, 0)}><div class="carta-toolbar-left svelte-1c77udu">${mode == "tabs" ? `<button type="button"${add_attribute("tabindex", 0, 0)}${add_attribute("class", tab === "write" ? "carta-active" : "", 0)}>${escape(labels.writeTab)}</button> <button type="button"${add_attribute("tabindex", -1, 0)}${add_attribute("class", tab === "preview" ? "carta-active" : "", 0)}>${escape(labels.previewTab)}</button>` : ``}</div> <div class="carta-filler svelte-1c77udu"></div> <div class="carta-toolbar-right svelte-1c77udu"${add_attribute("this", iconsContainer, 0)}>${!(mode === "tabs" && tab === "preview") ? `${each(visibleIcons, (icon, index) => {
    let label = labels.iconsLabels[icon.id] ?? icon.label;
    return ` <button class="carta-icon svelte-1c77udu"${add_attribute("tabindex", index == 0 ? 0 : -1, 0)}${add_attribute("title", label, 0)}${add_attribute("aria-label", label, 0)}>${validate_component(icon.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})} </button>`;
  })} ${iconsHidden ? (() => {
    let label = labels.iconsLabels["menu"] ?? "Menu";
    return ` <button class="carta-icon svelte-1c77udu"${add_attribute("tabindex", -1, 0)}${add_attribute("title", label, 0)}${add_attribute("aria-label", label, 0)}>${validate_component(MenuIcon, "MenuIcon").$$render($$result, {}, {}, {})}</button>`;
  })() : ``}` : ``}</div></div> ${``}`;
});
const css$1 = {
  code: ".carta-editor.svelte-11jlii3{position:relative;display:flex;flex-direction:column}.carta-container.mode-split > *{width:50%}.carta-container.mode-tabs > *{width:100%}.carta-container.svelte-11jlii3{display:flex;position:relative}",
  map: null
};
const MarkdownEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { theme = "default" } = $$props;
  let { value = "" } = $$props;
  let { mode = "auto" } = $$props;
  let { scroll = "sync" } = $$props;
  let { disableToolbar = false } = $$props;
  let { placeholder = "" } = $$props;
  let { textarea = {} } = $$props;
  let { selectedTab = "write" } = $$props;
  let { labels: userLabels = {} } = $$props;
  const labels = { ...defaultLabels, ...userLabels };
  let windowMode;
  let resizeInput;
  let editorElem;
  let inputElem;
  let rendererElem;
  let currentScrollPercentage = 0;
  function loadScrollPosition(tab) {
    if (windowMode !== "tabs")
      return;
    const elem = tab === "write" ? inputElem : rendererElem;
    if (!elem)
      return;
    const avbSpace = elem.scrollHeight - elem.clientHeight;
    elem.scroll({
      top: avbSpace * currentScrollPercentage,
      behavior: "instant"
    });
  }
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0)
    $$bindings.carta(carta);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0)
    $$bindings.theme(theme);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  if ($$props.scroll === void 0 && $$bindings.scroll && scroll !== void 0)
    $$bindings.scroll(scroll);
  if ($$props.disableToolbar === void 0 && $$bindings.disableToolbar && disableToolbar !== void 0)
    $$bindings.disableToolbar(disableToolbar);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.textarea === void 0 && $$bindings.textarea && textarea !== void 0)
    $$bindings.textarea(textarea);
  if ($$props.selectedTab === void 0 && $$bindings.selectedTab && selectedTab !== void 0)
    $$bindings.selectedTab(selectedTab);
  if ($$props.labels === void 0 && $$bindings.labels && userLabels !== void 0)
    $$bindings.labels(userLabels);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        windowMode = mode === "auto" ? "tabs" : mode;
      }
    }
    {
      {
        resizeInput && resizeInput();
      }
    }
    {
      {
        loadScrollPosition(selectedTab);
      }
    }
    $$rendered = `  <div class="${"carta-editor carta-theme__" + escape(theme, true) + " svelte-11jlii3"}"${add_attribute("this", editorElem, 0)}>${!disableToolbar ? `${validate_component(Toolbar, "Toolbar").$$render(
      $$result,
      {
        carta,
        labels,
        mode: windowMode,
        tab: selectedTab
      },
      {
        tab: ($$value) => {
          selectedTab = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``} <div class="carta-wrapper"><div class="${"carta-container mode-" + escape(windowMode, true) + " svelte-11jlii3"}">${windowMode == "split" || selectedTab == "write" ? `${validate_component(Input, "Input").$$render(
      $$result,
      {
        carta,
        placeholder,
        props: textarea,
        value,
        resize: resizeInput,
        elem: inputElem
      },
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        resize: ($$value) => {
          resizeInput = $$value;
          $$settled = false;
        },
        elem: ($$value) => {
          inputElem = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return ` ${``}`;
        }
      }
    )}` : ``} ${windowMode == "split" || selectedTab == "preview" ? `${validate_component(Renderer, "Renderer").$$render(
      $$result,
      { carta, value, elem: rendererElem },
      {
        elem: ($$value) => {
          rendererElem = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return ` ${``}`;
        }
      }
    )}` : ``}</div></div>   ${``} </div>`;
  } while (!$$settled);
  return $$rendered;
});
const css = {
  code: '.carta-font-code{font-family:"...", monospace;font-size:1.1rem}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $editedPost, $$unsubscribe_editedPost;
  $$unsubscribe_editedPost = subscribe(editedPost, (value) => $editedPost = value);
  const carta = new Carta({
    // Remember to use a sanitizer to prevent XSS attacks!
    // More on that below
    sanitizer: false
  });
  let title = "";
  let content = "";
  let category = "";
  let uploadName = "";
  if ($editedPost !== "") {
    Server.getPost($editedPost).then((e) => {
      title = e.title;
      content = e.desc;
      category = e.category;
      editedPost.set(``);
    });
  }
  Server.init();
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<h1 data-svelte-h="svelte-1iu5ycm">Post Form</h1> <label for="title" data-svelte-h="svelte-kpfkpc">Title:</label><br> <input type="text" id="title"${add_attribute("value", title, 0)}><br> <label for="category" data-svelte-h="svelte-1qmhjiw">Category:</label><br> <input type="text" id="category"${add_attribute("value", category, 0)}><br> <label for="content" data-svelte-h="svelte-135u9wq">Content:</label><br> ${validate_component(MarkdownEditor, "MarkdownEditor").$$render(
      $$result,
      { carta, value: content },
      {
        value: ($$value) => {
          content = $$value;
          $$settled = false;
        }
      },
      {}
    )} <button data-svelte-h="svelte-1gle3be">Submit</button> <h1 data-svelte-h="svelte-19xfttp">Image Form</h1> <input type="file" accept="image/*"> <pre>${escape(uploadName)}</pre>`;
  } while (!$$settled);
  $$unsubscribe_editedPost();
  return $$rendered;
});
export {
  Page as default
};
