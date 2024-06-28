import { marked } from "marked";
import "./client.js";
var PageModule;
((PageModule2) => {
  PageModule2.view = (text) => {
    return marked(text);
  };
  PageModule2.getDate = (date) => {
    let d = new Date(date.seconds * 1e3);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };
})(PageModule || (PageModule = {}));
export {
  PageModule as P
};
