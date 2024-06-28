

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BziTt6Uv.js","_app/immutable/chunks/scheduler.CHuYOiVl.js","_app/immutable/chunks/index.DWuiTTQc.js","_app/immutable/chunks/firebase.Dk5fKxNb.js","_app/immutable/chunks/isAdmin.Bt4mJtq6.js","_app/immutable/chunks/index.DU30lrAz.js"];
export const stylesheets = ["_app/immutable/assets/3.CWwtrN3D.css"];
export const fonts = [];
