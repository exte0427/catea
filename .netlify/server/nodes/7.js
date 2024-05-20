import * as universal from '../entries/pages/posts/_id_/_page.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_id_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/posts/[id]/+page.ts";
export const imports = ["_app/immutable/nodes/7.TC7ByEBT.js","_app/immutable/chunks/scheduler.Va3TKrii.js","_app/immutable/chunks/index.BbABBdpA.js","_app/immutable/chunks/editPost.C0HpcXN-.js","_app/immutable/chunks/index.EDsSI1DB.js","_app/immutable/chunks/isAdmin.BmiFR_Vs.js","_app/immutable/chunks/pageModule.CRuyTWCW.js","_app/immutable/chunks/entry.Bqw0Lxl3.js","_app/immutable/chunks/firebase.BrCaKxce.js"];
export const stylesheets = ["_app/immutable/assets/7.CJSIQx3F.css"];
export const fonts = [];
