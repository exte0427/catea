import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.DoSY9H0Z.js","_app/immutable/chunks/scheduler.KZfC4eOj.js","_app/immutable/chunks/index.DgoC0QsE.js","_app/immutable/chunks/firebase.BO4NuSoU.js"];
export const stylesheets = ["_app/immutable/assets/2.DqaNvV_r.css","_app/immutable/assets/CateaImg.CSLxY5tq.css","_app/immutable/assets/LikeButton.EQ6Hzf0r.css"];
export const fonts = [];
