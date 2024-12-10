import React, { useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '../src/context/AuthContext';

export default function Index() {
  const { userToken, isLoading } = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for token loading to finish
    if (userToken) {
      router.replace('/todos');
    } else {
      router.replace('/login');
    }
  }, [isLoading, userToken, router]);

  return null; // Don't render anything until auth state is resolved
};
