// Meme API Service - Fetch short video clips for content population
import axios from 'axios';

// Story Categories with themed video content
const STORY_CATEGORIES = {
  adventure: {
    name: "Adventure",
    icon: "🗺️",
    description: "Epic journeys and exploration"
  },
  mystery: {
    name: "Mystery", 
    icon: "🕵️",
    description: "Suspenseful and intriguing content"
  },
  comedy: {
    name: "Comedy",
    icon: "😂", 
    description: "Funny and entertaining videos"
  },
  drama: {
    name: "Drama",
    icon: "🎭",
    description: "Emotional and character-driven stories"
  },
  action: {
    name: "Action",
    icon: "⚡",
    description: "High-energy and thrilling content"
  },
  romance: {
    name: "Romance",
    icon: "💕",
    description: "Love stories and relationships"
  },
  scifi: {
    name: "Sci-Fi",
    icon: "🚀",
    description: "Futuristic and technology themes"
  },
  fantasy: {
    name: "Fantasy",
    icon: "🧙",
    description: "Magical and mythical adventures"
  }
};

// Sample video URLs categorized for story creation
const STORY_VIDEOS = {
  adventure: [
    {
      id: "adv_1",
      title: "Mountain Explorer",
      description: "A brave adventurer begins their journey into the unknown mountains, where ancient secrets await discovery.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://picsum.photos/400/300?random=1",
      duration: 30,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "adventure",
      storyPotential: "high"
    },
    {
      id: "adv_2", 
      title: "Forest Quest",
      description: "Deep in the enchanted forest, our hero discovers a hidden path that leads to an ancient temple.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://picsum.photos/400/300?random=2",
      duration: 45,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "adventure",
      storyPotential: "high"
    }
  ],
  mystery: [
    {
      id: "mys_1",
      title: "The Detective's Dilemma",
      description: "A seasoned detective faces their most challenging case yet - one that hits close to home.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://picsum.photos/400/300?random=3",
      duration: 60,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "mystery",
      storyPotential: "high"
    },
    {
      id: "mys_2",
      title: "Vanishing Act",
      description: "When a famous magician disappears during their final trick, the investigation reveals dark secrets.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "https://picsum.photos/400/300?random=4",
      duration: 35,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "mystery",
      storyPotential: "high"
    }
  ],
  comedy: [
    {
      id: "com_1",
      title: "Office Chaos",
      description: "A simple day at the office turns into hilarious mayhem when the coffee machine breaks down.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail: "https://picsum.photos/400/300?random=5",
      duration: 40,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "comedy",
      storyPotential: "medium"
    },
    {
      id: "com_2",
      title: "Cooking Catastrophe",
      description: "An ambitious chef attempts to create the world's most complex dish, with predictably funny results.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "https://picsum.photos/400/300?random=6",
      duration: 50,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "comedy",
      storyPotential: "medium"
    }
  ],
  action: [
    {
      id: "act_1",
      title: "High-Speed Chase",
      description: "An intense pursuit through the city streets where every second counts and danger lurks around every corner.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnail: "https://picsum.photos/400/300?random=7",
      duration: 25,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "action",
      storyPotential: "high"
    }
  ],
  scifi: [
    {
      id: "sci_1",
      title: "Future Warrior",
      description: "In a dystopian future, a lone warrior must choose between saving humanity or preserving peace.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnail: "https://picsum.photos/400/300?random=8",
      duration: 55,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "scifi",
      storyPotential: "high"
    },
    {
      id: "sci_2",
      title: "Steel Dreams",
      description: "When artificial intelligence gains consciousness, the line between human and machine becomes blurred.",
      videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnail: "https://picsum.photos/400/300?random=10",
      duration: 75,
      votes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      category: "scifi",
      storyPotential: "high"
    }
  ]
};

// Flatten all videos for general access
const ALL_STORY_VIDEOS = Object.values(STORY_VIDEOS).flat();

// Main API functions
const fetchMemeVideos = async (category = 'all', count = 10) => {
  try {
    console.log(`🎬 Fetching ${count} videos for category: ${category}`);
    
    let videos = [];
    
    if (category === 'all' || category === 'trending') {
      // Return shuffled videos from all categories
      videos = ALL_STORY_VIDEOS.sort(() => 0.5 - Math.random());
    } else if (STORY_VIDEOS[category]) {
      // Return videos from specific category
      videos = [...STORY_VIDEOS[category]];
    } else {
      // Fallback to all videos if category not found
      videos = ALL_STORY_VIDEOS.sort(() => 0.5 - Math.random());
    }
    
    const selected = videos.slice(0, count);
    
    console.log(`✅ Successfully fetched ${selected.length} story videos for ${category}`);
    return {
      success: true,
      data: selected,
      count: selected.length,
      message: `Story videos loaded successfully for ${category}`,
      category: category
    };
  } catch (error) {
    console.error('❌ Error fetching videos:', error);
    return {
      success: false,
      data: [],
      count: 0,
      message: 'Failed to fetch videos'
    };
  }
};

// Get videos by category
const getVideosByCategory = async (category) => {
  return await fetchMemeVideos(category, 12);
};

// Get available story categories
const getStoryCategories = () => {
  return Object.entries(STORY_CATEGORIES).map(([key, value]) => ({
    value: key,
    label: value.name,
    icon: value.icon,
    description: value.description
  }));
};

// Get random video
const getRandomVideo = async () => {
  const randomIndex = Math.floor(Math.random() * ALL_STORY_VIDEOS.length);
  return {
    success: true,
    data: ALL_STORY_VIDEOS[randomIndex],
    message: 'Random story video selected'
  };
};

// Test video URL
const testVideoUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Default export object matching VideoPopulator's expected structure
const memeApiService = {
  fetchMemeVideos,
  getVideosByCategory,
  getStoryCategories,
  getRandomVideo,
  testVideoUrl,
  STORY_CATEGORIES,
  STORY_VIDEOS,
  ALL_STORY_VIDEOS
};

export default memeApiService;
