

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.D1V9v_C6.js","_app/immutable/chunks/scheduler.KZfC4eOj.js","_app/immutable/chunks/index.DgoC0QsE.js","_app/immutable/chunks/firebase.BO4NuSoU.js","_app/immutable/chunks/isAdmin.CkVtTagH.js","_app/immutable/chunks/index.G0QxKvjB.js"];
export const stylesheets = ["_app/immutable/assets/3.B3hM1Fq8.css"];
export const fonts = [];
