import {initializeApp} from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, endAt, getFirestore, onSnapshot, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
    apiKey: "AIzaSyBdB4F38VQhOtqufqPTE2iy2Dwkz73to6A",
    authDomain: "catea-d779d.firebaseapp.com",
    projectId: "catea-d779d",
    storageBucket: "catea-d779d.appspot.com",
    messagingSenderId: "3408765623",
    appId: "1:3408765623:web:dc717cf526b06cf75ce332",
    measurementId: "G-81B3YNFD1Q"
};

initializeApp(firebaseConfig);

export namespace Server{
    export const init= ()=>{
    }

    export class Post{
        title:string;
        desc:string;
        date:Timestamp;
        id:string;
        like:string[];
        category:string;
        constructor(e:any){
            const data = e.data();
            this.title=data.title;
            this.desc=data.desc;
            this.date=data.date;
            this.id = e.id;
            this.like = data.like;
            this.category = data.category;
        }

    }

    export const getPosts=()=>new Promise((resolve : (value: Post[]) => void, reject) => {
        const db = getFirestore();
        const rawPosts = collection(db,'posts');
        
        onSnapshot(rawPosts, (snapshot) => {
            const posts:Post[]=[];
            snapshot.forEach(e=>{
                const data = e.data();
                const nowPost = new Post(e);
                posts.push(nowPost);
            });

            resolve(posts);
        });
    });

    export const toggleLike=(postId:string)=>new Promise((resolve:(data:boolean)=>void,reject)=>{
        const response = fetch('https://us-central1-catea-d779d.cloudfunctions.net/updateLike', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            postId: postId
            })
        }).then((response) => {
            const result = response.text().then((data)=>{
                console.log(result);
                resolve(true); 
            });
        });

        
    });

    export const getPost=(id:string)=>new Promise((resolve : (value: Post) => void,reject)=>{
        const db = getFirestore();
        const rawData = doc(db, `posts`,id);
        onSnapshot(rawData, (snapshot) => {
            resolve(new Post(snapshot));
        });
    });

    export const addPost=(title:string, desc:string,category:string)=> new Promise((resolve,reject)=>{
        const date = new Date(); // 현재 시간을 ISO 형식의 문자열로 변환
        const db = getFirestore();

        addDoc(collection(db,"posts"),{
            title: title,
            desc: desc,
            date: date,
            category: category,
            like:0
        }).then(()=>{
            resolve(true);
        });
    });

    export const editPost=(title:string, desc:string,category:string,postId:string)=> new Promise((resolve,reject)=>{
        const date = new Date(); // 현재 시간을 ISO 형식의 문자열로 변환
        const db = getFirestore();

        updateDoc(doc(getFirestore(),"posts",postId),{
            title: title,
            desc: desc,
            date: date,
            category: category,
            like:0
        }).then(()=>{
            resolve(true);
        });
    });

    export const deletePost=(postId:string)=>new Promise((resolve:(date:boolean)=>void,reject)=>{
        try{
            deleteDoc(doc(getFirestore(),"posts",postId)).then(()=>{
                resolve(true);
            });
        }catch(err){
            resolve(false);
        }
    });

    export const addFile=(data:File)=> new Promise((resolve:(data:string)=>void,reject)=>{
        const storage = getStorage();
        const exe = data.name.slice((Math.max(0, data.name.lastIndexOf(".")) || Infinity) + 1);
        const storageRef = ref(storage, `${uuidv4()}.${exe}`);
        uploadBytes(storageRef, data).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url)=>{
                resolve(url);
            });
        });
    });

    export const auth=(id:string, password:string)=>new Promise(((resolve : (value: boolean) => void,reject)=>{
        const authObject =  getAuth();
        signInWithEmailAndPassword(authObject, id, password).then((userCredential) => {
            resolve(true);
        }).catch((error) => {
            resolve(false);
        });
    }));

    export const isAdmin=():boolean=>{
        return getAuth().currentUser !== null;
    }

}