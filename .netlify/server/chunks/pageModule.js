import { marked } from "marked";
import "./client.js";
var PageModule;
((PageModule2) => {
  PageModule2.view = (text) => {
    return marked(text);
  };
})(PageModule || (PageModule = {}));
export {
  PageModule as P
};
