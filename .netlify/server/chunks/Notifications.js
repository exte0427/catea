import { c as create_ssr_component, a as add_attribute, o as onDestroy, v as validate_component, b as subscribe, d as each } from "./ssr.js";
import { s as store } from "./Notifications.svelte_svelte_type_style_lang.js";
import { r as remove } from "./acts.js";
const css$1 = {
  code: "._tadashi_svelte_notification.svelte-1b9tluh.svelte-1b9tluh{position:relative;display:grid;grid-template-columns:1fr 40px;grid-gap:1px;margin:var(--tadashi_svelte_notification_margin, 0 0 0.9em);border-radius:var(--tadashi_svelte_notification_border_radius, 3px);box-shadow:var(--tadashi_svelte_notification_box_shadow, 0 4px 10px hsl(0deg 0% 0% / 10%));overflow:hidden}._tadashi_svelte_notification__content.svelte-1b9tluh.svelte-1b9tluh{padding:var(--tadashi_svelte_notification__content_padding, 0.9em);box-sizing:border-box;word-wrap:break-word}._tadashi_svelte_notification__btn.svelte-1b9tluh.svelte-1b9tluh{padding:0;margin:0;border:none;border-radius:0;outline:none;background:none;cursor:pointer;box-sizing:border-box;font-size:var(--tadashi_svelte_notification__btn_font_size, 1.5em);font-family:var(--tadashi_svelte_notification__btn_font_family, monospace)}._tadashi_svelte_notification__btn.svelte-1b9tluh.svelte-1b9tluh:after{content:var(--tadashi_svelte_notification__btn__after_content, '✗')}._tadashi_svelte_notification.svelte-1b9tluh>._tadashi_svelte_notification__content.svelte-1b9tluh,._tadashi_svelte_notification.svelte-1b9tluh>._tadashi_svelte_notification__btn.svelte-1b9tluh{background:var(--tadashi_svelte_notification_background, hsl(0deg 100% 100% / 90%));color:var(--tadashi_svelte_notification_color, hsl(0deg 0% 0%))}._tadashi_svelte_notification__success.svelte-1b9tluh>._tadashi_svelte_notification__content.svelte-1b9tluh,._tadashi_svelte_notification__success.svelte-1b9tluh>._tadashi_svelte_notification__btn.svelte-1b9tluh{background:var(--tadashi_svelte_notification__success_background, hsl(149deg 96% 42% / 90%));color:var(--tadashi_svelte_notification__success_color, hsl(0deg 100% 100%))}._tadashi_svelte_notification__warning.svelte-1b9tluh>._tadashi_svelte_notification__content.svelte-1b9tluh,._tadashi_svelte_notification__warning.svelte-1b9tluh>._tadashi_svelte_notification__btn.svelte-1b9tluh{background:var(--tadashi_svelte_notification__warning_background, hsl(44deg 100% 50% / 90%));color:var(--tadashi_svelte_notification__warning_color, hsl(0deg 0% 0%))}._tadashi_svelte_notification__danger.svelte-1b9tluh>._tadashi_svelte_notification__content.svelte-1b9tluh,._tadashi_svelte_notification__danger.svelte-1b9tluh>._tadashi_svelte_notification__btn.svelte-1b9tluh{background:var(--tadashi_svelte_notification__danger_background, hsl(359deg 88% 64% / 90%));color:var(--tadashi_svelte_notification__danger_color, hsl(0deg 100% 100%))}._tadashi_svelte_notification__info.svelte-1b9tluh>._tadashi_svelte_notification__content.svelte-1b9tluh,._tadashi_svelte_notification__info.svelte-1b9tluh>._tadashi_svelte_notification__btn.svelte-1b9tluh{background:var(--tadashi_svelte_notification__info_background, hsl(213deg 56% 47% / 90%));color:var(--tadashi_svelte_notification__info_color, hsl(0deg 100% 100%))}",
  map: null
};
const Base = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { mode } = $$props;
  let { id } = $$props;
  const modes = {
    ok: "Success",
    success: "Success",
    warning: "Warning",
    warn: "Warning",
    error: "Error",
    danger: "Error",
    info: "Information"
  };
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  $$result.css.add(css$1);
  return `<div role="alert" aria-atomic="true"${add_attribute("aria-label", modes?.[mode] ?? "Normal", 0)}${add_attribute("aria-describedby", id, 0)} class="${[
    "_tadashi_svelte_notification svelte-1b9tluh",
    (mode === "success" || mode === "ok" ? "_tadashi_svelte_notification__success" : "") + " " + (mode === "warning" || mode === "warn" ? "_tadashi_svelte_notification__warning" : "") + " " + (mode === "danger" || mode === "error" ? "_tadashi_svelte_notification__danger" : "") + " " + (mode === "info" ? "_tadashi_svelte_notification__info" : "")
  ].join(" ").trim()}"><div class="_tadashi_svelte_notification__content svelte-1b9tluh"${add_attribute("id", id, 0)}>${slots.default ? slots.default({}) : ``}</div> <button aria-label="Remove notification" class="_tadashi_svelte_notification__btn svelte-1b9tluh"></button> </div>`;
});
const Notification = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { notification } = $$props;
  const { mode = "normal", message = "", lifetime = 0, id } = notification;
  let _timeout;
  if (lifetime > 0) {
    _timeout = setTimeout(
      () => {
        remove(notification);
      },
      lifetime * 1e3
    );
  }
  onDestroy(() => {
    if (_timeout) {
      clearTimeout(_timeout);
    }
  });
  if ($$props.notification === void 0 && $$bindings.notification && notification !== void 0)
    $$bindings.notification(notification);
  return `${validate_component(Base, "Base").$$render($$result, { mode, id }, {}, {
    default: () => {
      return `<!-- HTML_TAG_START -->${message}<!-- HTML_TAG_END -->`;
    }
  })}`;
});
const css = {
  code: "._tadashi_svelte_notifications.svelte-hnkiua{position:fixed;width:var(--tadashi_svelte_notifications_width, 270px);margin:var(--tadashi_svelte_notifications_margin, 0.9em);top:0;right:0;z-index:var(--tadashi_svelte_notifications_zindex, 1001)}",
  map: null
};
const Notifications = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $store, $$unsubscribe_store;
  $$unsubscribe_store = subscribe(store, (value) => $store = value);
  $$result.css.add(css);
  $$unsubscribe_store();
  return `${$store.size > 0 ? `<div class="_tadashi_svelte_notifications svelte-hnkiua">${each([...$store], (notification) => {
    return `${validate_component(Notification, "Notification").$$render($$result, { notification }, {}, {})}`;
  })}</div>` : ``}`;
});
export {
  Notifications as N
};
