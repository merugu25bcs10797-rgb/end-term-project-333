import { useState, useCallback } from 'react';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { toast } from 'react-toastify';

/**
 * Custom hook for Firestore CRUD operations.
 * Provides a reusable, error-handled interface for any collection.
 * @param {string} collectionName - The Firestore collection to operate on.
 */
const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to add: ${err.message}`);
      console.error(`useFirestore [${collectionName}] addDocument error:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to delete: ${err.message}`);
      console.error(`useFirestore [${collectionName}] deleteDocument error:`, err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const updateDocument = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update: ${err.message}`);
      console.error(`useFirestore [${collectionName}] updateDocument error:`, err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  return { addDocument, deleteDocument, updateDocument, loading, error };
};

export default useFirestore;
