import { marked } from "marked";
import { page } from '$app/stores';
import type { Timestamp } from "firebase/firestore";

export namespace PageModule{

    export const view=(text:string)=>{
        return marked(text);
    }

    export const getDate=(date:Timestamp)=>{
        let d=new Date(date.seconds*1000);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }
}