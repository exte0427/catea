

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BcFz3uEj.js","_app/immutable/chunks/scheduler.ClHcrxuI.js","_app/immutable/chunks/index.Cdp6gip_.js","_app/immutable/chunks/firebase.Dk5fKxNb.js","_app/immutable/chunks/isAdmin.Cc5LVXs3.js","_app/immutable/chunks/index.CMG81xFu.js"];
export const stylesheets = ["_app/immutable/assets/3.CWwtrN3D.css"];
export const fonts = [];
