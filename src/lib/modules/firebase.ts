import {initializeApp} from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
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

export const DAMI_FEEDBACK_CATEGORY = '__dami_feedback__';

export type DamiFeedback = {
    id: string;
    authorId: string;
    url: string;
    body: string;
    note: string;
    nickname: string;
    passwordHash: string;
    durationMs: number;
    createdAt: Date | null;
};

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
                if (data.category === DAMI_FEEDBACK_CATEGORY) return;
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

    export const ensureGuestAuth = () =>
        new Promise<void>((resolve) => {
            const auth = getAuth();
            if (auth.currentUser) {
                resolve();
                return;
            }
            signInAnonymously(auth)
                .then(() => resolve())
                .catch((err) => {
                    // Anonymous가 꺼져 있거나 제한된 프로젝트에서는 인증 없이 진행
                    console.warn('Guest auth skipped:', err?.code || err);
                    resolve();
                });
        });

    export const submitDamiFeedback = (
        meta: {
            authorId: string;
            body: string;
            note?: string;
            nickname?: string;
            passwordHash?: string;
            durationMs?: number;
            blob?: Blob | null;
        },
        onProgress?: (percent: number) => void
    ) =>
        new Promise<DamiFeedback>((resolve, reject) => {
            const fail = (err: any) => {
                const code = err?.code ? `[${err.code}] ` : '';
                const message = err?.message || String(err);
                reject(new Error(`${code}${message}`));
            };

            const saveDoc = (url: string) => {
                const nickname = meta.nickname ?? '';
                const body = meta.body ?? '';
                const passwordHash = meta.passwordHash ?? '';
                const payload = {
                    authorId: meta.authorId,
                    url,
                    body,
                    note: meta.note ?? body,
                    nickname,
                    passwordHash,
                    durationMs: meta.durationMs ?? 0
                };

                return addDoc(collection(getFirestore(), 'posts'), {
                    title: `[DAMI] ${nickname || '익명'}`,
                    desc: JSON.stringify(payload),
                    date: new Date(),
                    category: DAMI_FEEDBACK_CATEGORY,
                    like: 0
                }).then((docRef) =>
                    resolve({
                        id: docRef.id,
                        authorId: meta.authorId,
                        url,
                        body,
                        note: meta.note ?? body,
                        nickname,
                        passwordHash,
                        durationMs: meta.durationMs ?? 0,
                        createdAt: new Date()
                    })
                );
            };

            const uploadAndSave = () => {
                if (!meta.blob) {
                    saveDoc('').catch(fail);
                    return;
                }

                const storage = getStorage();
                const fileName = `${uuidv4()}.webm`;
                const storageRef = ref(storage, fileName);
                const task = uploadBytesResumable(storageRef, meta.blob, {
                    contentType: meta.blob.type || 'video/webm'
                });

                task.on(
                    'state_changed',
                    (snapshot) => {
                        if (!onProgress || !snapshot.totalBytes) return;
                        onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    },
                    fail,
                    () => {
                        getDownloadURL(task.snapshot.ref)
                            .then((url) => saveDoc(url))
                            .catch(fail);
                    }
                );
            };

            ensureGuestAuth().finally(uploadAndSave);
        });

    const parseFeedbackDoc = (e: { id: string; data: () => any }): DamiFeedback | null => {
        const data = e.data();
        if (data.category !== DAMI_FEEDBACK_CATEGORY) return null;

        let payload: Partial<DamiFeedback> = {};
        try {
            payload = JSON.parse(data.desc || '{}');
        } catch {
            payload = { body: data.desc || '' };
        }

        const created =
            data.date?.toDate?.() ??
            (data.date instanceof Date ? data.date : null);

        return {
            id: e.id,
            authorId: payload.authorId ?? '',
            url: payload.url ?? '',
            body: payload.body ?? payload.note ?? '',
            note: payload.note ?? '',
            nickname: payload.nickname ?? '',
            passwordHash: payload.passwordHash ?? '',
            durationMs: payload.durationMs ?? 0,
            createdAt: created
        };
    };

    const mapFeedbackSnapshot = (snapshot: { forEach: (fn: (e: any) => void) => void }) => {
        const items: DamiFeedback[] = [];
        snapshot.forEach((e) => {
            const item = parseFeedbackDoc(e);
            if (item) items.push(item);
        });
        items.sort((a, b) => {
            const at = a.createdAt?.getTime?.() ?? 0;
            const bt = b.createdAt?.getTime?.() ?? 0;
            return bt - at;
        });
        return items;
    };

    const feedbackQuery = () =>
        query(collection(getFirestore(), 'posts'), where('category', '==', DAMI_FEEDBACK_CATEGORY));

    export const getDamiFeedbacks = () =>
        new Promise<DamiFeedback[]>((resolve, reject) => {
            getDocs(feedbackQuery())
                .then((snapshot) => resolve(mapFeedbackSnapshot(snapshot)))
                .catch(reject);
        });

    /** 목록을 실시간으로 구독 (첫 스냅샷이 오면 바로 콜백) */
    export const subscribeDamiFeedbacks = (onData: (items: DamiFeedback[]) => void, onError?: (err: unknown) => void) =>
        onSnapshot(
            feedbackQuery(),
            (snapshot) => onData(mapFeedbackSnapshot(snapshot)),
            (err) => onError?.(err)
        );

    export const getDamiFeedback = (id: string) =>
        new Promise<DamiFeedback | null>((resolve, reject) => {
            getDoc(doc(getFirestore(), 'posts', id))
                .then((snapshot) => {
                    if (!snapshot.exists()) {
                        resolve(null);
                        return;
                    }
                    resolve(parseFeedbackDoc(snapshot));
                })
                .catch(reject);
        });

    export const updateDamiFeedback = (
        id: string,
        meta: {
            body: string;
            nickname: string;
            passwordHash: string;
            url: string;
            authorId: string;
            durationMs: number;
        }
    ) =>
        new Promise<boolean>((resolve, reject) => {
            const payload = {
                authorId: meta.authorId,
                url: meta.url,
                body: meta.body,
                note: meta.body,
                nickname: meta.nickname,
                passwordHash: meta.passwordHash,
                durationMs: meta.durationMs
            };
            updateDoc(doc(getFirestore(), 'posts', id), {
                title: `[DAMI] ${meta.nickname || '익명'}`,
                desc: JSON.stringify(payload),
                date: new Date(),
                category: DAMI_FEEDBACK_CATEGORY
            })
                .then(() => resolve(true))
                .catch(reject);
        });

    export const deleteDamiFeedback = (id: string) =>
        new Promise<boolean>((resolve, reject) => {
            deleteDoc(doc(getFirestore(), 'posts', id))
                .then(() => resolve(true))
                .catch(reject);
        });

}