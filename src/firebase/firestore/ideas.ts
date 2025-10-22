
'use client';
import { addDoc, collection, Firestore } from 'firebase/firestore';
import type { Idea } from '@/lib/data';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type NewIdea = Omit<Idea, 'id'>;

export async function addIdea(
  firestore: Firestore,
  idea: NewIdea
): Promise<Idea> {
  const ideasCollection = collection(firestore, 'ideas');
  
  try {
    // Add the status to the idea if it's not present
    const ideaWithStatus = {
      status: 'Pending', // Default status
      ...idea,
    };
    const docRef = await addDoc(ideasCollection, ideaWithStatus);
    return { ...ideaWithStatus, id: docRef.id };
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
