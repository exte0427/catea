import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.Dvr2labh.js","_app/immutable/chunks/scheduler.Va3TKrii.js","_app/immutable/chunks/index.BbABBdpA.js","_app/immutable/chunks/firebase.BrCaKxce.js","_app/immutable/chunks/Take.DkcFWcKZ.js"];
export const stylesheets = ["_app/immutable/assets/2.DVKYMURz.css","_app/immutable/assets/Take.D6pnBnA7.css"];
export const fonts = [];
