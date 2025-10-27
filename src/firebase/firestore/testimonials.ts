
'use client';
import { addDoc, collection, Firestore, serverTimestamp } from 'firebase/firestore';
import type { Testimonial } from '@/lib/data';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type NewTestimonial = Omit<Testimonial, 'id' | 'createdAt' | 'status'>;

export async function addTestimonial(
  firestore: Firestore,
  testimonial: NewTestimonial
): Promise<Testimonial> {
  const testimonialsCollection = collection(firestore, 'testimonials');
  
  try {
    const testimonialWithStatus = {
      status: 'Pending', // Default status
      ...testimonial,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(testimonialsCollection, testimonialWithStatus);
    return { ...testimonialWithStatus, id: docRef.id, createdAt: new Date() };
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: testimonialsCollection.path,
      operation: 'create',
      requestResourceData: testimonial,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  }
}
