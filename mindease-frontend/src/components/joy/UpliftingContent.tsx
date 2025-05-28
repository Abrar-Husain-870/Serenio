import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiHeart, FiCopy, FiShare2, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Enhanced content array with more jokes, memes, and categories
const sampleContent: ContentItem[] = [
  // Quotes
  {
    id: 1,
    type: 'quote',
    category: 'inspiration',
    content: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
    likes: 42,
    imageUrl: null
  },
  {
    id: 2,
    type: 'quote',
    category: 'inspiration',
    content: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
    likes: 85,
    imageUrl: null
  },
  {
    id: 3,
    type: 'quote',
    category: 'inspiration',
    content: "Every moment is a fresh beginning.",
    author: "T.S. Eliot",
    likes: 67,
    imageUrl: null
  },
  
  // Updated Memes with reliable, copyright-free URLs
  {
    id: 4,
    type: 'meme',
    category: 'tech',
    content: "When your code works on the first try",
    author: null,
    likes: 128,
    imageUrl: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 5,
    type: 'meme',
    category: 'animals',
    content: "Looking at cute animal pictures has been scientifically proven to boost mood",
    author: null,
    likes: 193,
    imageUrl: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  
  // Jokes
  {
    id: 6,
    type: 'joke',
    category: 'programming',
    content: "Why do programmers prefer dark mode? Because light attracts bugs!",
    author: null,
    likes: 156,
    imageUrl: null
  },
  {
    id: 7,
    type: 'joke',
    category: 'dad',
    content: "Why don't scientists trust atoms? Because they make up everything!",
    author: null,
    likes: 134,
    imageUrl: null
  },
  {
    id: 8,
    type: 'joke',
    category: 'pun',
    content: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    author: null,
    likes: 98,
    imageUrl: null
  },
  {
    id: 9,
    type: 'joke',
    category: 'programming',
    content: "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    author: null,
    likes: 112,
    imageUrl: null
  },
  
  // AI Jokes
  {
    id: 10,
    type: 'ai_joke',
    category: 'ai',
    content: "Why did the AI go to therapy? It had too many deep learning issues!",
    author: "AI Assistant",
    likes: 76,
    imageUrl: null
  },
  {
    id: 11,
    type: 'ai_joke',
    category: 'ai',
    content: "I asked an AI to make me a sandwich. It gave me a picture of a sandwich with 99.8% accuracy!",
    author: "AI Assistant",
    likes: 88,
    imageUrl: null
  },
  {
    id: 12,
    type: 'ai_joke',
    category: 'ai',
    content: "What do you call an AI that sings? Artificial Harmonies!",
    author: "AI Assistant",
    likes: 65,
    imageUrl: null
  },
  
  // Fun facts
  {
    id: 13,
    type: 'fact',
    category: 'science',
    content: "Laughing for 10-15 minutes can burn up to 40 calories. It's a mini-workout!",
    author: null,
    likes: 105,
    imageUrl: null
  },
  {
    id: 14,
    type: 'fact',
    category: 'psychology',
    content: "Smiling, even when you don't feel happy, can actually improve your mood by triggering the release of endorphins.",
    author: null,
    likes: 118,
    imageUrl: null
  },
  
  // Updated Visual memes with reliable, copyright-free URLs
  {
    id: 15,
    type: 'meme',
    category: 'mental_health',
    content: "Me promising myself I'll be productive tomorrow while watching 5 more episodes at 2 AM",
    author: null,
    likes: 245,
    imageUrl: "https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 16,
    type: 'meme',
    category: 'animals',
    content: "When someone asks how you're doing and you've been practicing your 'I'm fine' face all day",
    author: null,
    likes: 267,
    imageUrl: "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 17,
    type: 'meme',
    category: 'lifestyle',
    content: "My brain at 3 AM: Remember that embarrassing thing you did 7 years ago?",
    author: null,
    likes: 301,
    imageUrl: "https://images.pexels.com/photos/3808057/pexels-photo-3808057.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  
  // Updated AI-generated memes with reliable, copyright-free URLs
  {
    id: 20,
    type: 'ai_meme',
    category: 'ai',
    content: "When AI tries to understand human emotions",
    author: "AI MemeGen",
    likes: 156,
    imageUrl: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 21,
    type: 'ai_meme',
    category: 'ai',
    content: "AI attempting to make a sandwich based on user instructions",
    author: "AI MemeGen",
    likes: 189,
    imageUrl: "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
];

// AI Joke Generator that uses external API
const generateAIJoke = async (): Promise<string> => {
  try {
    console.log('Generating AI joke using external API');
    
    // Use a reliable joke API instead of ML model
    const response = await fetch("https://icanhazdadjoke.com/", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "MindEase Mental Health App (https://mindease.com)"
      }
    });

    if (!response.ok) {
      throw new Error(`Joke API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Adapt the joke to be mental health themed
    if (data && data.joke) {
      // Process the joke to make it more relevant to mental health
      return addMentalHealthContextToJoke(data.joke);
    } else {
      // Fallback if the API response is unexpected
      return "Why did the meditation app and the journal become friends? They both knew how to keep things 'mindful'!";
    }
  } catch (error) {
    console.error('Error generating AI joke:', error);
    // Use a fallback joke if we can't generate one
    const fallbackJokes = [
      "Why did the therapist tell the clock to relax? Because it was too wound up!",
      "How does a therapist greet their computer? 'Hello, how are you feeling today? Have you tried turning yourself off and on again?'",
      "What's a psychiatrist's favorite type of music? Break-through-beats!",
      "My therapist once told me: ",
      "During meditation, I realized: ",
      "Mental health tip of the day: ",
      "My mindfulness app notification said: ",
      "Self-care reminder: ",
      "My inner voice when I'm practicing positivity: "
    ];
    
    // Return a random fallback joke
    return fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
  }
};

// Function to adapt general jokes to be more mental health themed
const addMentalHealthContextToJoke = (joke: string): string => {
  // List of mental health themed adaptations
  const mentalHealthPrefixes = [
    "My therapist once told me: ",
    "During meditation, I realized: ",
    "Mental health tip of the day: ",
    "My mindfulness app notification said: ",
    "Self-care reminder: ",
    "My inner voice when I'm practicing positivity: "
  ];
  
  // Either use the joke as is or add a mental health context
  // 50% chance to modify the joke
  if (Math.random() > 0.5) {
    const prefix = mentalHealthPrefixes[Math.floor(Math.random() * mentalHealthPrefixes.length)];
    return prefix + joke;
  }
  
  return joke;
};

// Simulate AI-generated memes with curated content
const generateAIMeme = async (): Promise<{ content: string, imageUrl: string }> => {
  try {
    console.log('Generating AI meme');
    
    // Use dynamic image categories from Unsplash to create variety
    const imageCategories = [
      "meditation",
      "mindfulness",
      "mental-health",
      "happiness",
      "calm",
      "nature",
      "relax",
      "success",
      "motivation",
      "self-care",
      "wellness",
      "joy"
    ];
    
    // Get a random category
    const randomCategory = imageCategories[Math.floor(Math.random() * imageCategories.length)];
    
    // Generate a dynamic search query
    const secondaryTerms = ["happy", "peaceful", "positive", "colorful", "inspiring", "uplifting"];
    const randomSecondaryTerm = secondaryTerms[Math.floor(Math.random() * secondaryTerms.length)];
    
    // Make each generated image unique with random parameters
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Create a randomized image URL that will be different each time
    const imageUrl = `https://source.unsplash.com/featured/?${randomCategory},${randomSecondaryTerm}&sig=${randomSeed}`;
    
    // Generate joke for caption using external API
    let customCaption;
    try {
      // Try to get a joke from API
      const jokeResponse = await fetch("https://icanhazdadjoke.com/", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "MindEase Mental Health App (https://mindease.com)"
        }
      });
      
      if (jokeResponse.ok) {
        const jokeData = await jokeResponse.json();
        if (jokeData && jokeData.joke) {
          customCaption = jokeData.joke;
        }
      }
    } catch (error) {
      console.error("Error fetching joke for meme caption:", error);
    }
    
    // If no joke was fetched, use mental health themed captions
    if (!customCaption) {
      const memeTexts = [
        "When your meditation app tells you to clear your mind, but your thoughts have other plans",
        "That feeling when your therapist says you're making progress",
        "Me trying to remember if I took my antidepressant this morning",
        "My mental health after 5 minutes of fresh air and sunshine",
        "Looking at all the problems I've overcome this year",
        "Self-care Sunday: expectation vs. reality",
        "That moment you realize growth isn't linear and that's perfectly okay",
        "When someone asks how therapy is going and you're actually doing better",
        "My brain: Let's think about that embarrassing thing from 10 years ago",
        "When you finally establish a healthy boundary",
        "My mood after remembering to drink water and go outside",
        "That moment when your coping mechanisms actually work"
      ];
      
      customCaption = memeTexts[Math.floor(Math.random() * memeTexts.length)];
    }
    
    // Adapt the joke to be mental health related if needed
    if (Math.random() > 0.7) { // 30% chance to adapt the caption
      const mentalHealthContexts = [
        "Me in therapy when ",
        "My anxiety when ",
        "My brain during meditation: ",
        "Self-care achievement unlocked: ",
        "Mental health progress be like: ",
        "When my therapist told me "
      ];
      
      const prefix = mentalHealthContexts[Math.floor(Math.random() * mentalHealthContexts.length)];
      customCaption = prefix + customCaption.charAt(0).toLowerCase() + customCaption.slice(1);
    }
    
    // Simulate a delay to make it feel like generation is happening
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log for debugging
    console.log('Generated AI meme with category:', randomCategory);
    
    return {
      content: customCaption,
      imageUrl: imageUrl
    };
  } catch (error) {
    console.error("Error generating AI meme:", error);
    throw error;
  }
};

// Component for handling image loading with fallback
const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  contentType: string;
}> = ({ src, alt, contentType }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  
  useEffect(() => {
    // Reset error state when src changes
    setHasError(false);
    setImgSrc(src);
  }, [src]);
  
  const fallbackSrc = 
    contentType === 'meme' || contentType === 'ai_meme' 
      ? "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=600" 
      : "https://images.pexels.com/photos/3957616/pexels-photo-3957616.jpeg?auto=compress&cs=tinysrgb&w=600";
  
  const handleError = () => {
    if (!hasError) {
      console.error("Image load error:", src);
      setHasError(true);
      setImgSrc(fallbackSrc);
      
      toast.info('Using alternate image', {
        position: 'bottom-right',
        autoClose: 2000
      });
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className="max-w-full max-h-[400px] object-contain"
      loading="lazy"
      onError={handleError}
    />
  );
};

interface ContentItem {
  id: number;
  type: 'quote' | 'meme' | 'joke' | 'ai_joke' | 'fact' | 'ai_meme';
  category: string;
  content: string;
  author: string | null;
  likes: number;
  imageUrl: string | null;
}

const UpliftingContent: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contents, setContents] = useState<ContentItem[]>(sampleContent);
  const [userLiked, setUserLiked] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filteredContents, setFilteredContents] = useState<ContentItem[]>(sampleContent);

  // Get current content based on filtered list
  const currentContent = filteredContents[currentIndex];

  // In a real app, you would fetch content from the backend
  useEffect(() => {
    // Simulate loading from backend
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update filtered content whenever filter changes
  useEffect(() => {
    try {
      if (!filterCategory) {
        // Show all content when no filter is applied
        setFilteredContents(contents);
      } else {
        // Filter content by category or type
        const filtered = contents.filter(item => 
          item.category === filterCategory || item.type === filterCategory
        );
        
        // Make sure we have a valid list
        setFilteredContents(filtered.length > 0 ? filtered : []);
      }
      
      // Reset to first item when filter changes, but only if we have content
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error filtering content:", error);
      // Fallback to showing all content if filtering fails
      setFilteredContents(contents);
      setCurrentIndex(0);
    }
  }, [filterCategory, contents]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredContents.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredContents.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleLike = (id: number) => {
    if (userLiked.includes(id)) {
      // Unlike
      setUserLiked(userLiked.filter((likedId) => likedId !== id));
      setContents(
        contents.map((item) =>
          item.id === id ? { ...item, likes: item.likes - 1 } : item
        )
      );
    } else {
      // Like
      setUserLiked([...userLiked, id]);
      setContents(
        contents.map((item) =>
          item.id === id ? { ...item, likes: item.likes + 1 } : item
        )
      );
      toast.success('Added to your favorites!', {
        position: 'bottom-right',
        autoClose: 2000
      });
    }
  };

  const handleCopy = () => {
    const textToCopy = currentContent.type === 'quote'
      ? `"${currentContent.content}" ${currentContent.author ? `- ${currentContent.author}` : ''}`
      : currentContent.content;
      
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast.success('Copied to clipboard!', {
          position: 'bottom-right',
          autoClose: 2000
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy to clipboard', {
          position: 'bottom-right',
          autoClose: 3000
        });
      }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Positive content from MindEase',
        text: currentContent.type === 'quote'
          ? `"${currentContent.content}" ${currentContent.author ? `- ${currentContent.author}` : ''}`
          : currentContent.content,
        url: window.location.href,
      })
      .then(() => {
        toast.success('Shared successfully!', {
          position: 'bottom-right',
          autoClose: 2000
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        toast.error('Failed to share content', {
          position: 'bottom-right',
          autoClose: 3000
        });
      });
    } else {
      handleCopy();
      toast.info('Sharing not supported by your browser. Content copied to clipboard instead.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };

  const handleGenerateAIMeme = async () => {
    try {
      toast.info('Generating AI meme...', {
        position: 'bottom-right',
        autoClose: 2000
      });
      
      // Generate a new meme
      const newMeme = await generateAIMeme();
      
      // Create a new ID that's guaranteed to be unique
      const newId = Math.max(...contents.map(item => item.id), 0) + 1;
      
      // Create the new meme object
      const aiMeme: ContentItem = {
        id: newId,
        type: 'ai_meme',
        category: 'ai',
        content: newMeme.content,
        author: 'AI MemeGen',
        likes: 0,
        imageUrl: newMeme.imageUrl
      };
      
      // First update main content array
      const updatedContents = [...contents, aiMeme];
      setContents(updatedContents);
      
      // Set category first, then update filtered contents after a small delay
      setFilterCategory('ai_meme');
      
      // Now ensure we're showing the new content by forcing an update to filteredContents
      // and setting the index directly
      const showNewMeme = () => {
        const aiMemes = updatedContents.filter(item => item.type === 'ai_meme');
        setFilteredContents(aiMemes);
        // Show the latest meme (at the end of the array)
        setCurrentIndex(aiMemes.length - 1);
        
        toast.success('Generated a fresh AI meme!', {
          position: 'bottom-right',
          autoClose: 2000
        });
      };
      
      // Small delay to ensure state updates properly
      setTimeout(showNewMeme, 50);
    } catch (error) {
      console.error("Error generating AI meme:", error);
      toast.error('Failed to generate meme. Please try again later.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };

  const handleGenerateAIJoke = async () => {
    try {
      toast.info('Generating AI joke...', {
        position: 'bottom-right',
        autoClose: 2000
      });
      
      // Get a joke from the AI
      const newJoke = await generateAIJoke();
      const newId = Math.max(...contents.map(item => item.id)) + 1;
      
      const aiJoke: ContentItem = {
        id: newId,
        type: 'ai_joke',
        category: 'ai',
        content: newJoke,
        author: 'AI Joker',
        likes: 0,
        imageUrl: null
      };
      
      setContents([...contents, aiJoke]);
      setFilterCategory('ai_joke');
      
      // Set index to show the new joke immediately
      setTimeout(() => {
        const aiJokes = contents.filter(item => item.type === 'ai_joke');
        setFilteredContents([...aiJokes, aiJoke]);
        setCurrentIndex(aiJokes.length);
        
        toast.success('Generated a fresh AI joke!', {
          position: 'bottom-right',
          autoClose: 2000
        });
      }, 100);
    } catch (error) {
      console.error("Error generating AI joke:", error);
      toast.error('Failed to generate joke. Please try again later.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };

  // Available categories for filtering
  const categories = [
    { id: null, name: 'All' },
    { id: 'quote', name: 'Quotes' },
    { id: 'joke', name: 'Jokes' },
    { id: 'ai_joke', name: 'AI Jokes' },
    { id: 'meme', name: 'Memes' },
    { id: 'ai_meme', name: 'AI Memes' },
    { id: 'fact', name: 'Fun Facts' }
  ];

  if (isLoading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Pick</h3>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 mb-2"></div>
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Loading content...</span>
          </div>
          <div className="flex space-x-2">
            <button className="btn btn-outline btn-sm" disabled>
              Previous
            </button>
            <button className="btn btn-primary btn-sm" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Uplifting Content</h2>
      <p className="text-gray-600 dark:text-gray-400">
        A curated collection of memes, jokes, and content to brighten your day.
      </p>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Positivity ({filteredContents.length > 0 ? `${currentIndex + 1}/${filteredContents.length}` : '0/0'})
          </h3>
          
          {/* Categories filter */}
          <div className="flex flex-wrap mt-2 md:mt-0 gap-2">
            {categories.map(category => (
              <button
                key={category.id || 'all'}
                onClick={() => setFilterCategory(category.id)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filterCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Generate buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleGenerateAIJoke}
            className="px-3 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center"
          >
            <FiRefreshCw className="mr-1 w-3 h-3" />
            Generate AI Joke
          </button>
          
          <button
            onClick={handleGenerateAIMeme}
            className="px-3 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center"
          >
            <FiRefreshCw className="mr-1 w-3 h-3" />
            Generate AI Meme
          </button>
        </div>
        
        {filteredContents.length === 0 ? (
          // Display when no content matches the filter
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">No content available for this category</p>
              <button 
                onClick={() => setFilterCategory(null)}
                className="btn btn-primary btn-sm"
              >
                View All Content
              </button>
            </div>
          </div>
        ) : (
          // Display when content is available
          <div className="relative">
            {/* Content Display */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 min-h-[200px]">
              {currentContent.type === 'quote' ? (
                <div className="flex flex-col items-center text-center">
                  <blockquote className="text-xl font-semibold text-gray-900 dark:text-white mb-4 italic">
                    "{currentContent.content}"
                  </blockquote>
                  {currentContent.author && (
                    <cite className="text-gray-600 dark:text-gray-400 not-italic">
                      — {currentContent.author}
                    </cite>
                  )}
                </div>
              ) : currentContent.type === 'joke' || currentContent.type === 'ai_joke' || currentContent.type === 'fact' ? (
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm w-full max-w-lg">
                    <p className="text-lg text-gray-900 dark:text-white mb-3">{currentContent.content}</p>
                    {currentContent.author && (
                      <p className="text-sm text-right text-gray-500 dark:text-gray-400">
                        — {currentContent.author}
                      </p>
                    )}
                    {currentContent.type === 'ai_joke' && (
                      <div className="mt-3 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded inline-block">
                        AI Generated
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {currentContent.imageUrl && (
                    <div className="w-full max-w-xl mx-auto">
                      <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-700 p-2">
                        <div className="min-h-[200px] flex items-center justify-center">
                          <ImageWithFallback 
                            src={currentContent.imageUrl}
                            alt={currentContent.content}
                            contentType={currentContent.type}
                          />
                        </div>
                      </div>
                      <p className="text-center mt-4 text-gray-900 dark:text-white font-medium">
                        {currentContent.content}
                      </p>
                      {currentContent.type === 'ai_meme' && (
                        <div className="mt-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded inline-block mx-auto flex justify-center">
                          AI Generated
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label="Previous content"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label="Next content"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
        
        {/* Only show actions and pagination if we have content */}
        {filteredContents.length > 0 && (
          <>
            {/* Actions */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center flex-wrap gap-2">
                <button 
                  onClick={() => handleLike(currentContent.id)}
                  className={`flex items-center mr-2 ${
                    userLiked.includes(currentContent.id) 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  aria-label={userLiked.includes(currentContent.id) ? "Unlike" : "Like"}
                >
                  <FiHeart className={`w-5 h-5 mr-1 ${
                    userLiked.includes(currentContent.id) 
                      ? 'fill-current' 
                      : ''
                  }`} />
                  <span>{currentContent.likes}</span>
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Copy to clipboard"
                >
                  <FiCopy className="w-5 h-5 mr-1" />
                  <span className="text-sm">Copy</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Share content"
                >
                  <FiShare2 className="w-5 h-5 mr-1" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={handlePrevious}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
            
            {/* Pagination Dots */}
            {filteredContents.length <= 10 && (
              <div className="flex justify-center mt-6 overflow-hidden">
                <div className="flex flex-wrap justify-center max-w-full gap-1">
                  {filteredContents.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 mx-0.5 rounded-full ${
                        index === currentIndex 
                          ? 'bg-primary-500 dark:bg-primary-400' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to item ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpliftingContent; 