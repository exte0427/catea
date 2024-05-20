import { marked } from "marked";
import { page } from '$app/stores';

export namespace PageModule{

    export const view=(text:string)=>{
        return marked(text);
    }
}