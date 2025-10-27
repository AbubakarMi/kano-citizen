
'use client';
import { addDoc, collection, Firestore, serverTimestamp } from 'firebase/firestore';
import type { Idea } from '@/lib/data';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type NewIdea = Omit<Idea, 'id' | 'createdAt'>;

export async function addIdea(
  firestore: Firestore,
  idea: NewIdea
): Promise<Idea> {
  const ideasCollection = collection(firestore, 'ideas');
  
  try {
    // Add the status and timestamp to the idea
    const ideaWithStatus = {
      status: 'Pending', // Default status
      ...idea,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(ideasCollection, ideaWithStatus);
    // Note: The `createdAt` on the returned object will be null until the server processes it.
    // For UI purposes, you might want to use a local new Date() temporarily.
    return { ...ideaWithStatus, id: docRef.id, createdAt: new Date() };
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: ideasCollection.path,
      operation: 'create',
      requestResourceData: idea,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the original error or a new error if you need to handle it further up the call stack
    throw permissionError;
  }
}
