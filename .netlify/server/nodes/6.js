import * as universal from '../entries/pages/posts/_id_/_page.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_id_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/posts/[id]/+page.ts";
export const imports = ["_app/immutable/nodes/6.BcG55oDK.js","_app/immutable/chunks/scheduler.ClHcrxuI.js","_app/immutable/chunks/index.Cdp6gip_.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/carta.qfwREXXz.js","_app/immutable/chunks/index.CMG81xFu.js","_app/immutable/chunks/preload-helper.BQ24v_F8.js","_app/immutable/chunks/isAdmin.Cc5LVXs3.js","_app/immutable/chunks/pageModule.faxKO4Z_.js","_app/immutable/chunks/entry.wWoJJejR.js","_app/immutable/chunks/firebase.Dk5fKxNb.js","_app/immutable/chunks/index.DLlQTGtu.js"];
export const stylesheets = ["_app/immutable/assets/6.BVtqp3Nf.css","_app/immutable/assets/carta.CGn-Evi2.css"];
export const fonts = [];
