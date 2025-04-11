import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from './firebase';

const storage = getStorage(app);

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress tracking can be implemented here if needed
        },
        (error: unknown) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error: unknown) {
            reject(error);
          }
        }
      );
    });
  } catch (error: unknown) {
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error: unknown) {
    throw new Error(`Failed to get file URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 