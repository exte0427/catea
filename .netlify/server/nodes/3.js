

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.ee2m3tw8.js","_app/immutable/chunks/scheduler.BxeZDt3k.js","_app/immutable/chunks/index.zOUk09vQ.js","_app/immutable/chunks/firebase.Dk5fKxNb.js","_app/immutable/chunks/isAdmin.D7wIQgZV.js","_app/immutable/chunks/index.CEICsKKB.js"];
export const stylesheets = ["_app/immutable/assets/3.CWwtrN3D.css"];
export const fonts = [];
