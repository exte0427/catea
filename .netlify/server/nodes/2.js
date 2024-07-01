import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.5bBEYY5R.js","_app/immutable/chunks/scheduler.ClHcrxuI.js","_app/immutable/chunks/index.Cdp6gip_.js","_app/immutable/chunks/firebase.Dk5fKxNb.js"];
export const stylesheets = ["_app/immutable/assets/2.BG9u1UFC.css","_app/immutable/assets/CateaImg.CSLxY5tq.css"];
export const fonts = [];
