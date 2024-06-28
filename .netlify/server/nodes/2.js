import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.DbMhuZII.js","_app/immutable/chunks/scheduler.CHuYOiVl.js","_app/immutable/chunks/index.DWuiTTQc.js","_app/immutable/chunks/firebase.Dk5fKxNb.js","_app/immutable/chunks/Take.DS0p2pAH.js"];
export const stylesheets = ["_app/immutable/assets/2.DYX313_Y.css","_app/immutable/assets/Take.Dyk6_Unb.css"];
export const fonts = [];
