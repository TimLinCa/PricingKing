import { db } from "../_utils/firebase";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    doc,
    where,
} from "firebase/firestore";

export const getSearchingBookMarks = async (userId) => {
    try {
        const usersCol = collection(db, `users/${userId}/searchingBookMarks`);
        const itemsSnapshot = await getDocs(usersCol);

        const items = itemsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return items;
    }
    catch (error) {
        console.error("Error in getItems:", error);
    }
}

export const addSearchingBookmark = async (userId, bookMark) => {
    const usersCol = collection(db, `users/${userId}/searchingBookMarks`);
    const newItem = await addDoc(usersCol, bookMark);
    return newItem.id;
}

export const deleteSearchingBookmark = async (userId, bookMarkId) => {
    bookMarkId = bookMarkId.toString();
    console.log(bookMarkId);
    const docRef = doc(db, `users/${userId}/searchingBookMarks`, bookMarkId);
    const docItem = await getDoc(docRef);
    deleteDoc(docRef);
}

