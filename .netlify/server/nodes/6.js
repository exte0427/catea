import * as universal from '../entries/pages/posts/_id_/_page.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_id_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/posts/[id]/+page.ts";
export const imports = ["_app/immutable/nodes/6.BVpWXsvj.js","_app/immutable/chunks/scheduler.KZfC4eOj.js","_app/immutable/chunks/index.DgoC0QsE.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/carta.hjFY4RAR.js","_app/immutable/chunks/index.G0QxKvjB.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/isAdmin.CkVtTagH.js","_app/immutable/chunks/pageModule.DY8Sl_48.js","_app/immutable/chunks/entry.s6iHcaIx.js","_app/immutable/chunks/firebase.BO4NuSoU.js","_app/immutable/chunks/Loading.CxuaLQ1p.js"];
export const stylesheets = ["_app/immutable/assets/6.DvtweJsr.css","_app/immutable/assets/LikeButton.EQ6Hzf0r.css","_app/immutable/assets/carta.CGn-Evi2.css","_app/immutable/assets/Loading.CVEwsA2A.css"];
export const fonts = [];
