import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.DpvUkL7z.js","_app/immutable/chunks/scheduler.CDsNrBCT.js","_app/immutable/chunks/index.iSaceN4G.js","_app/immutable/chunks/firebase.hkRIpkTM.js","_app/immutable/chunks/Take.C5lH9JJz.js","_app/immutable/chunks/Notifications.svelte_svelte_type_style_lang.B_ZR81ZN.js","_app/immutable/chunks/index.B_03h_l8.js"];
export const stylesheets = ["_app/immutable/assets/2.DVKYMURz.css","_app/immutable/assets/Take.D6pnBnA7.css","_app/immutable/assets/Notifications.C_noNbb5.css"];
export const fonts = [];
