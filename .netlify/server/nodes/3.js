

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.3IwBOrwa.js","_app/immutable/chunks/scheduler.Va3TKrii.js","_app/immutable/chunks/index.BbABBdpA.js","_app/immutable/chunks/firebase.BrCaKxce.js","_app/immutable/chunks/isAdmin.BmiFR_Vs.js","_app/immutable/chunks/index.EDsSI1DB.js"];
export const stylesheets = [];
export const fonts = [];
