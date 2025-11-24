'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WormholeLoader from '@/components/WormholeLoader';
import { generatePortrait } from '@/lib/worldlines';

export default function GeneratePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    const selectedWorldline = sessionStorage.getItem('selectedWorldline');

    if (!uploadedImage || !selectedWorldline) {
      router.push('/portal');
      return;
    }

    // Convert base64 to File object for the mock function
    fetch(uploadedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'upload.jpg', { type: 'image/jpeg' });
        
        // Start generation
        generatePortrait(file, selectedWorldline, (newProgress) => {
          setProgress(newProgress);
        }).then((generatedImageUrl) => {
          // Store result and navigate
          sessionStorage.setItem('generatedImage', generatedImageUrl);
          setTimeout(() => {
            router.push('/result');
          }, 500);
        });
      });
  }, [router]);

  return <WormholeLoader progress={progress} />;
}

