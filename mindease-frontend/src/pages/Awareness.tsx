import React, { useState } from 'react';
import { FiInfo, FiBookOpen, FiBriefcase, FiUsers, FiHeart, FiExternalLink } from 'react-icons/fi';
import { Card } from '@chakra-ui/react';

interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: 'article' | 'video' | 'organization' | 'app';
}

interface MentalHealthCondition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  coping: string[];
  expanded: boolean;
}

const Awareness: React.FC = () => {
  // Mental health conditions with information
  const [conditions, setConditions] = useState<MentalHealthCondition[]>([
    {
      id: '1',
      name: 'Anxiety Disorders',
      description: 'Anxiety disorders are characterized by excessive fear or worry that interferes with daily activities. They are among the most common mental health conditions.',
      symptoms: [
        'Excessive worry or fear',
        'Feeling restless or on-edge',
        'Rapid heart rate and breathing',
        'Difficulty concentrating',
        'Sleep problems',
        'Avoidance of anxiety-triggering situations'
      ],
      coping: [
        'Practice deep breathing and mindfulness meditation',
        'Regular physical exercise',
        'Maintain a regular sleep schedule',
        'Consider cognitive behavioral therapy (CBT)',
        'In some cases, medication may be prescribed by a doctor'
      ],
      expanded: false
    },
    {
      id: '2',
      name: 'Depression',
      description: 'Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest. It affects how you feel, think and behave and can lead to a variety of emotional and physical problems.',
      symptoms: [
        'Persistent sad, anxious, or "empty" mood',
        'Loss of interest in activities once enjoyed',
        'Decreased energy or fatigue',
        'Difficulty sleeping or oversleeping',
        'Changes in appetite or weight',
        'Thoughts of death or suicide'
      ],
      coping: [
        'Regular exercise and outdoor activities',
        'Maintain social connections',
        'Establish a routine and set achievable goals',
        'Psychotherapy (talk therapy)',
        'Medication when prescribed by a healthcare provider'
      ],
      expanded: false
    },
    {
      id: '3',
      name: 'Post-Traumatic Stress Disorder (PTSD)',
      description: 'PTSD is a disorder that develops in some people who have experienced a shocking, scary, or dangerous event. It can cause intense, disturbing thoughts and feelings related to the experience that last long after the traumatic event has ended.',
      symptoms: [
        'Intrusive memories or flashbacks of the traumatic event',
        'Nightmares related to the trauma',
        'Severe emotional distress when reminded of the event',
        'Avoidance of situations that remind you of the event',
        'Negative changes in thinking and mood',
        'Changes in physical and emotional reactions'
      ],
      coping: [
        'Trauma-focused cognitive behavioral therapy',
        'Eye Movement Desensitization and Reprocessing (EMDR)',
        'Support groups with others who have experienced similar traumas',
        'Self-care practices like meditation and physical exercise',
        'Medication when prescribed by a healthcare provider'
      ],
      expanded: false
    },
    {
      id: '4',
      name: 'Bipolar Disorder',
      description: 'Bipolar disorder causes unusual shifts in mood, energy, activity levels, concentration, and the ability to carry out day-to-day tasks. There are typically periods of abnormally elevated mood (mania) and periods of depression.',
      symptoms: [
        'Manic episodes: increased energy, reduced need for sleep, racing thoughts',
        'Depressive episodes: feeling sad, empty, hopeless, decreased energy',
        'Changes in sleep patterns',
        'Difficulty concentrating and making decisions',
        'Impulsive behavior during manic episodes',
        'Thoughts of death or suicide during depressive episodes'
      ],
      coping: [
        'Mood stabilizing medications as prescribed',
        'Regular therapy sessions',
        'Maintaining a stable daily routine',
        'Tracking mood changes',
        'Getting adequate sleep',
        'Avoiding alcohol and recreational drugs'
      ],
      expanded: false
    }
  ]);

  // Resources for mental health
  const resources: Resource[] = [
    {
      id: '1',
      title: 'National Alliance on Mental Illness (NAMI)',
      description: 'NAMI provides advocacy, education, support and public awareness so that all individuals and families affected by mental illness can build better lives.',
      link: 'https://www.nami.org/',
      category: 'organization'
    },
    {
      id: '2',
      title: 'Mental Health America',
      description: 'Mental Health America is the nation\'s leading community-based nonprofit dedicated to addressing the needs of those living with mental illness.',
      link: 'https://www.mhanational.org/',
      category: 'organization'
    },
    {
      id: '3',
      title: 'Understanding Anxiety and Depression',
      description: 'An in-depth article explaining the causes, symptoms, and treatments for anxiety and depression.',
      link: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
      category: 'article'
    },
    {
      id: '4',
      title: 'Mindfulness Meditation for Beginners',
      description: 'A 15-minute guided meditation video specifically designed for people experiencing anxiety or depression.',
      link: 'https://www.youtube.com/results?search_query=mindfulness+meditation+for+beginners',
      category: 'video'
    },
    {
      id: '5',
      title: 'Headspace',
      description: 'An app that teaches meditation and mindfulness skills to help with stress, anxiety, sleep, and more.',
      link: 'https://www.headspace.com/',
      category: 'app'
    },
    {
      id: '6',
      title: 'Crisis Text Line',
      description: 'Free 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the USA to text with a trained Crisis Counselor.',
      link: 'https://www.crisistextline.org/',
      category: 'organization'
    }
  ];

  // Toggle expanded state for conditions
  const toggleExpanded = (id: string) => {
    setConditions(conditions.map(condition => 
      condition.id === id 
        ? { ...condition, expanded: !condition.expanded } 
        : condition
    ));
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mental Health Awareness</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Learn about different mental health conditions, their symptoms, and ways to cope. Education is the first step toward understanding and healing.
        </p>
      </div>

      {/* Statistics Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="flex items-center mb-4">
          <FiInfo className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Mental Health Facts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <p className="text-2xl font-bold">1 in 5</p>
            <p className="text-sm">Adults experience mental illness each year</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <p className="text-2xl font-bold">50%</p>
            <p className="text-sm">Mental health conditions begin by age 14</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <p className="text-2xl font-bold">300 Million+</p>
            <p className="text-sm">People worldwide suffer from depression</p>
          </div>
        </div>
        <p className="text-sm text-white/80 text-center">
          Source: World Health Organization and National Alliance on Mental Illness
        </p>
      </div>

      {/* Common Mental Health Conditions */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FiBookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Common Mental Health Conditions</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Understanding these conditions can help you identify symptoms in yourself or loved ones and seek appropriate help.
        </p>
        <div className="space-y-4">
          {conditions.map(condition => (
            <div key={condition.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded(condition.id)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white">{condition.name}</span>
                <span className={`transform transition-transform ${condition.expanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {condition.expanded && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{condition.description}</p>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Common Symptoms:</h3>
                  <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-400">
                    {condition.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Coping Strategies:</h3>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {condition.coping.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Self-Care Tips */}
      <Card.Root>
        <Card.Body>
          <div className="flex items-center mb-4">
            <FiHeart className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Self-Care Practices</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Taking care of your mental health is just as important as physical health. Here are some daily practices that can help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card.Root variant="subtle">
              <Card.Body>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Mindfulness Meditation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Practice being present in the moment without judgment. Just 5-10 minutes daily can reduce stress and anxiety.
                </p>
              </Card.Body>
            </Card.Root>
            <Card.Root variant="subtle">
              <Card.Body>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Physical Exercise</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Regular physical activity releases endorphins, which naturally boost mood and reduce stress hormones.
                </p>
              </Card.Body>
            </Card.Root>
            <Card.Root variant="subtle">
              <Card.Body>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Healthy Sleep Habits</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Maintain a regular sleep schedule. Poor sleep can worsen symptoms of many mental health conditions.
                </p>
              </Card.Body>
            </Card.Root>
            <Card.Root variant="subtle">
              <Card.Body>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Social Connection</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Maintain relationships with supportive friends and family. Social isolation can worsen depression and anxiety.
                </p>
              </Card.Body>
            </Card.Root>
          </div>
        </Card.Body>
      </Card.Root>

      {/* Stigma Reduction */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reducing Stigma</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Mental health stigma can prevent people from seeking help. Here are ways to combat stigma:
        </p>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Talk openly</strong> about mental health to normalize the conversation</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Educate yourself and others</strong> about mental health conditions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Use respectful language</strong> that doesn't define people by their condition</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Share your experiences</strong> if you're comfortable doing so</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span><strong>Show compassion</strong> for those with mental health conditions</span>
          </li>
        </ul>
      </div>

      {/* Resources */}
      <Card.Root>
        <Card.Body>
          <div className="flex items-center mb-4">
            <FiBriefcase className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Helpful Resources</h2>
          </div>
          <div className="space-y-4">
            {resources.map(resource => (
              <Card.Root key={resource.id} variant="subtle">
                <Card.Body>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 mt-1">
                      {resource.category === 'organization' && <FiUsers className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                      {resource.category === 'article' && <FiBookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                      {resource.category === 'video' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-primary-600 dark:text-primary-400"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {resource.category === 'app' && <FiHeart className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{resource.description}</p>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 mt-2"
                      >
                        Visit resource
                        <FiExternalLink className="ml-1 w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card.Root>
            ))}
          </div>
        </Card.Body>
      </Card.Root>

      {/* Emergency Information */}
      <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">If You're in Crisis</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          If you or someone you know is in immediate danger or having thoughts of suicide, please reach out for help immediately:
        </p>
        <div className="space-y-2">
          <div className="font-medium text-gray-900 dark:text-white">National Suicide Prevention Lifeline:</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">988 or 1-800-273-8255</div>
          <div className="text-gray-600 dark:text-gray-400 mb-2">Available 24 hours, 7 days a week</div>
          
          <div className="font-medium text-gray-900 dark:text-white mt-4">Crisis Text Line:</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">Text HOME to 741741</div>
          <div className="text-gray-600 dark:text-gray-400">Available 24/7 for crisis support</div>
        </div>
      </div>
    </div>
  );
};

export default Awareness; 