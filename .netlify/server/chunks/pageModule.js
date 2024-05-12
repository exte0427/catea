import { marked } from "marked";
var PageModule;
((PageModule2) => {
  PageModule2.getPage = (index) => {
    return window.location.pathname.split("/")[index - 1];
  };
  PageModule2.view = (text) => {
    return marked(text);
  };
})(PageModule || (PageModule = {}));
export {
  PageModule as P
};
