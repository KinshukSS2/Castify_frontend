// Quick fix script to replace timeout videos with working ones
import axios from 'axios';

const WORKING_VIDEOS = [
  {
    title: "Big Buck Bunny",
    description: "Classic animation demo video",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://picsum.photos/400/300?random=1",
    duration: 596
  },
  {
    title: "Elephant Dream",
    description: "Beautiful 3D animated short film",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://picsum.photos/400/300?random=2", 
    duration: 653
  },
  {
    title: "For Bigger Blazes",
    description: "Action-packed demo content",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://picsum.photos/400/300?random=3",
    duration: 15
  },
  {
    title: "For Bigger Escape",
    description: "High-quality sample video",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://picsum.photos/400/300?random=4",
    duration: 15
  },
  {
    title: "For Bigger Fun",
    description: "Fun and engaging content",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://picsum.photos/400/300?random=5",
    duration: 60
  }
];

export const replaceTimeoutVideos = async () => {
  try {
    console.log('🔄 Starting to replace timeout videos...');
    
    // Create axios instance for backend
    const api = axios.create({
      baseURL: 'http://localhost:8000/api/v1',
      withCredentials: true
    });
    
    // Add working videos to database
    for (const video of WORKING_VIDEOS) {
      try {
        const response = await api.post('/videos/publish-url', {
          title: video.title,
          description: video.description,
          videoUrl: video.videoFile,
          thumbnailUrl: video.thumbnail,
          duration: video.duration
        });
        
        console.log(`✅ Added: ${video.title}`);
      } catch (error) {
        console.log(`❌ Failed to add: ${video.title}`, error.response?.status);
      }
    }
    
    console.log('🎉 Finished replacing videos!');
    return true;
  } catch (error) {
    console.error('❌ Error replacing videos:', error);
    return false;
  }
};

export default { replaceTimeoutVideos, WORKING_VIDEOS };
