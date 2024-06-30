import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.DaisblvO.js","_app/immutable/chunks/scheduler.BxeZDt3k.js","_app/immutable/chunks/index.zOUk09vQ.js","_app/immutable/chunks/firebase.Dk5fKxNb.js","_app/immutable/chunks/Take.D90PFrmL.js"];
export const stylesheets = ["_app/immutable/assets/2.BSeQIP9F.css","_app/immutable/assets/CateaImg.CSLxY5tq.css","_app/immutable/assets/Take.Dyk6_Unb.css"];
export const fonts = [];
