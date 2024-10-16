'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const CreateTestApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createTestApiKey = async () => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isTestKey: true }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.key) {
          setApiKey(data.key);
        } else {
          throw new Error('API key not found in response');
        }
      } else if (response.status === 303) {
        router.push('/pricing');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create test API key');
      }
    } catch (error) {
      console.error('Error creating test API key:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating the test API key');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Test API Key</h1>
      {!apiKey && (
        <button
          onClick={createTestApiKey}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Test API Key
        </button>
      )}
      {apiKey && (
        <div className="mt-4">
          <p className="font-semibold">Your test API key (expires in 24 hours):</p>
          <code className="bg-gray-100 p-2 rounded block mt-2">{apiKey}</code>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}