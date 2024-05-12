import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
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
var Server;
((Server2) => {
  Server2.init = () => {
  };
  class Post {
    title;
    desc;
    date;
    id;
    constructor(e) {
      const data = e.data();
      this.title = data.title;
      this.desc = data.desc;
      this.date = data.date;
      this.id = e.id;
    }
  }
  Server2.Post = Post;
  Server2.getPosts = () => new Promise((resolve, reject) => {
    const db = getFirestore();
    const rawPosts = collection(db, "posts");
    onSnapshot(rawPosts, (snapshot) => {
      const posts = [];
      snapshot.forEach((e) => {
        e.data();
        const nowPost = new Post(e);
        posts.push(nowPost);
      });
      resolve(posts);
    });
  });
  Server2.getPost = (id) => new Promise((resolve, reject) => {
    const db = getFirestore();
    const rawData = doc(db, `posts`, id);
    onSnapshot(rawData, (snapshot) => {
      resolve(new Post(snapshot));
    });
  });
  Server2.addPost = (title, desc) => new Promise((resolve, reject) => {
    const date = /* @__PURE__ */ new Date();
    const db = getFirestore();
    addDoc(collection(db, "posts"), {
      title,
      desc,
      date
    }).then(() => {
      resolve(true);
    });
  });
  Server2.deletePost = (postId) => new Promise((resolve, reject) => {
    try {
      deleteDoc(doc(getFirestore(), "posts", postId)).then(() => {
        resolve(true);
      });
    } catch (err) {
      resolve(false);
    }
  });
  Server2.addFile = (data) => new Promise((resolve, reject) => {
    const storage = getStorage();
    const exe = data.name.slice((Math.max(0, data.name.lastIndexOf(".")) || Infinity) + 1);
    const storageRef = ref(storage, `${v4()}.${exe}`);
    uploadBytes(storageRef, data).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        resolve(url);
      });
    });
  });
  Server2.auth = (id, password) => new Promise((resolve, reject) => {
    const authObject = getAuth();
    signInWithEmailAndPassword(authObject, id, password).then((userCredential) => {
      resolve(true);
    }).catch((error) => {
      resolve(false);
    });
  });
  Server2.isAdmin = () => {
    return getAuth().currentUser !== null;
  };
})(Server || (Server = {}));
export {
  Server as S
};
