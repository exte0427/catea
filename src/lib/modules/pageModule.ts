import { marked } from "marked";

export namespace PageModule{
    export const getPage=(index:number)=>{
        return window.location.pathname.split("/")[index-1];
    }

    export const view=(text:string)=>{
        return marked(text);
    }
}