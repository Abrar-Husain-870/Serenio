// Mock API implementation for development when backend is not accessible
// This simulates API responses without needing a backend server

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password' // In a real app, this would be hashed
  }
];

// Mock activities
const mockActivities = [
  { id: '1', title: 'Meditation', duration: 15, completed: true },
  { id: '2', title: 'Deep Breathing', duration: 5, completed: false },
  { id: '3', title: 'Journaling', duration: 10, completed: false }
];

// Mock mood entries
const mockMoods = [
  { id: '1', mood: 'Happy', notes: 'Had a great day', date: '2023-06-01' },
  { id: '2', mood: 'Anxious', notes: 'Stressed about deadline', date: '2023-06-02' },
  { id: '3', mood: 'Calm', notes: 'Meditation helped', date: '2023-06-03' }
];

// Mock journal entries
const mockJournalEntries = [
  { id: '1', title: 'First day', content: 'Started my wellness journey', date: '2023-06-01' },
  { id: '2', title: 'Progress', content: 'Feeling better already', date: '2023-06-03' }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    await delay(500); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token: 'mock-jwt-token'
      }
    };
  },
  
  register: async (name: string, email: string, password: string) => {
    await delay(500); // Simulate network delay
    
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      password
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: {
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
        token: 'mock-jwt-token'
      }
    };
  },
  
  getCurrentUser: async () => {
    await delay(300);
    const user = mockUsers[0]; // Just return the first user for demo
    return { id: user.id, name: user.name, email: user.email };
  },
  
  // Activities endpoints
  getActivities: async () => {
    await delay(300);
    return { success: true, data: mockActivities };
  },
  
  addActivity: async (activity: any) => {
    await delay(300);
    const newActivity = {
      id: (mockActivities.length + 1).toString(),
      ...activity
    };
    mockActivities.push(newActivity);
    return { success: true, data: newActivity };
  },
  
  // Moods endpoints
  getMoods: async () => {
    await delay(300);
    return { success: true, data: mockMoods };
  },
  
  addMood: async (mood: any) => {
    await delay(300);
    const newMood = {
      id: (mockMoods.length + 1).toString(),
      ...mood,
      date: new Date().toISOString().split('T')[0]
    };
    mockMoods.push(newMood);
    return { success: true, data: newMood };
  },
  
  // Journal endpoints
  getJournalEntries: async () => {
    await delay(300);
    return { success: true, data: mockJournalEntries };
  },
  
  addJournalEntry: async (entry: any) => {
    await delay(300);
    const newEntry = {
      id: (mockJournalEntries.length + 1).toString(),
      ...entry,
      date: new Date().toISOString().split('T')[0]
    };
    mockJournalEntries.push(newEntry);
    return { success: true, data: newEntry };
  },
  
  // Review endpoints
  getReviewData: async () => {
    await delay(500);
    return {
      success: true,
      data: {
        averageMood: 'Positive',
        moodTrend: 'Improving',
        topActivities: ['Meditation', 'Journaling'],
        insights: 'You\'ve been consistent with your mindfulness practice'
      }
    };
  },
  
  // Progress endpoints
  getProgressData: async () => {
    await delay(500);
    return {
      success: true,
      data: {
        completedActivities: 15,
        streakDays: 7,
        moodImprovement: '20%',
        weeklyStats: {
          meditation: 5,
          journaling: 3,
          breathing: 2
        }
      }
    };
  }
}; 