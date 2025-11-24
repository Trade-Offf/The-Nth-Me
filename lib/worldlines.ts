import { Worldline } from './types';

export const worldlines: Worldline[] = [
  {
    id: 'cyberpunk',
    name: '赛博纪元',
    description: '霓虹闪烁的未来都市，机械与血肉的完美融合',
    imageUrl: 'https://images.unsplash.com/photo-1635241161466-541f065683ba?w=800&q=80',
  },
  {
    id: 'tang-dynasty',
    name: '大唐盛世',
    description: '盛唐风华，锦绣繁荣的东方古韵',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
  },
  {
    id: 'wasteland',
    name: '废土行者',
    description: '末日荒原中的孤独旅者，在废墟中寻找希望',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    id: 'magic-academy',
    name: '魔法学院',
    description: '神秘的魔法世界，掌握元素的力量',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  },
  {
    id: 'steampunk',
    name: '蒸汽朋克',
    description: '齿轮与蒸汽的时代，维多利亚式的机械美学',
    imageUrl: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&q=80',
  },
  {
    id: 'space-explorer',
    name: '星际探索者',
    description: '穿梭于星海之间，探索未知的宇宙边疆',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80',
  },
  {
    id: 'noir-detective',
    name: '黑色侦探',
    description: '1940年代的都市暗影，追寻真相的孤独侦探',
    imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&q=80',
  },
  {
    id: 'anime-hero',
    name: '动漫英雄',
    description: '二次元世界的热血冒险，守护重要之人',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
  },
];

// Mock generation function
export async function generatePortrait(
  imageFile: File,
  worldlineId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Simulate processing with progress updates
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (onProgress) {
        onProgress(Math.min(progress, 100));
      }
      if (progress >= 100) {
        clearInterval(interval);
        // Return a mock generated image (in real app, this would be the AI result)
        const worldline = worldlines.find(w => w.id === worldlineId);
        resolve(worldline?.imageUrl || '');
      }
    }, 150); // 3 seconds total (20 steps * 150ms)
  });
}

