import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../services/firebase';
import {
  collection, onSnapshot, query, where,
  addDoc, deleteDoc, doc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Real-time Firestore listeners
  useEffect(() => {
    if (!currentUser) {
      setSubjects([]);
      setTopics([]);
      setTasks([]);
      return;
    }

    const qSubjects = query(collection(db, 'subjects'), where('uid', '==', currentUser.uid));
    const unSubSubjects = onSnapshot(qSubjects, (snapshot) => {
      setSubjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => toast.error(`Subjects sync error: ${err.message}`));

    const qTopics = query(collection(db, 'topics'), where('uid', '==', currentUser.uid));
    const unSubTopics = onSnapshot(qTopics, (snapshot) => {
      setTopics(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => toast.error(`Topics sync error: ${err.message}`));

    const qTasks = query(collection(db, 'tasks'), where('uid', '==', currentUser.uid));
    const unSubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => toast.error(`Tasks sync error: ${err.message}`));

    return () => {
      unSubSubjects();
      unSubTopics();
      unSubTasks();
    };
  }, [currentUser]);

  // --- useMemo: Derived stats (prevents recalc on every render) ---
  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const overdue = tasks.filter(
      t => t.status === 'Pending' && t.deadline && new Date(t.deadline) < new Date()
    ).length;
    return {
      totalSubjects: subjects.length,
      totalTopics: topics.length,
      totalTasks: tasks.length,
      completedTasks: completed,
      pendingTasks: tasks.length - completed,
      overdueTasks: overdue,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    };
  }, [subjects, tasks, topics]);

  // --- Subjects CRUD (useCallback prevents unnecessary re-renders in consumers) ---
  const addSubject = useCallback(async (subject) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'subjects'), {
        ...subject,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      toast.success('Subject added!');
    } catch (err) {
      toast.error(`Failed to add subject: ${err.message}`);
    }
  }, [currentUser]);

  const removeSubject = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'subjects', id));
      // Also remove related topics
      const relatedTopics = topics.filter(t => t.subjectId === id);
      await Promise.all(relatedTopics.map(t => deleteDoc(doc(db, 'topics', t.id))));
      toast.success('Subject removed.');
    } catch (err) {
      toast.error(`Failed to remove subject: ${err.message}`);
    }
  }, [topics]);

  // --- Topics CRUD ---
  const addTopic = useCallback(async (topic) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'topics'), {
        ...topic,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      toast.error(`Failed to add topic: ${err.message}`);
    }
  }, [currentUser]);

  const removeTopic = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'topics', id));
    } catch (err) {
      toast.error(`Failed to remove topic: ${err.message}`);
    }
  }, []);

  const updateTopic = useCallback(async (id, data) => {
    try {
      await updateDoc(doc(db, 'topics', id), { ...data, updatedAt: serverTimestamp() });
    } catch (err) {
      toast.error(`Failed to update topic: ${err.message}`);
    }
  }, []);

  // --- Tasks CRUD ---
  const addTask = useCallback(async (task) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      toast.success('Task created!');
    } catch (err) {
      toast.error(`Failed to add task: ${err.message}`);
    }
  }, [currentUser]);

  const removeTask = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      toast.success('Task removed.');
    } catch (err) {
      toast.error(`Failed to remove task: ${err.message}`);
    }
  }, []);

  const toggleTask = useCallback(async (id, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        status: currentStatus === 'Completed' ? 'Pending' : 'Completed',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      toast.error(`Failed to update task: ${err.message}`);
    }
  }, []);

  const updateTask = useCallback(async (id, data) => {
    try {
      await updateDoc(doc(db, 'tasks', id), { ...data, updatedAt: serverTimestamp() });
      toast.success('Task updated!');
    } catch (err) {
      toast.error(`Failed to update task: ${err.message}`);
    }
  }, []);

  const value = {
    // Data
    subjects, topics, tasks, stats,
    // Subject actions
    addSubject, removeSubject,
    // Topic actions
    addTopic, removeTopic, updateTopic,
    // Task actions
    addTask, removeTask, toggleTask, updateTask,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};
