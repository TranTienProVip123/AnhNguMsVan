import Topic from '../models/Topic.js';

export const listTopics = async ({ category }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;
  const topics = await Topic.find(filter)
    .select('-words')
    .sort({ createdAt: -1 });
  return topics.map(t => ({
    id: t._id,
    name: t.name,
    image: t.image,
    description: t.description,
    category: t.category,
    totalWords: t.totalWords,
    progress: 0,
    learnedWords: 0
  }));
};

export const getTopicDetail = async (id) => {
  const topic = await Topic.findById(id);
  if (!topic) return { reason: 'NOT_FOUND' };
  return {
    topic: {
      id: topic._id,
      name: topic.name,
      image: topic.image,
      description: topic.description,
      category: topic.category,
      totalWords: topic.totalWords,
      words: topic.words,
      progress: 0,
      learnedWords: 0
    }
  };
};

export const createTopic = async (payload) => {
  if (await Topic.findOne({ name: payload.name })) return { reason: 'DUPLICATE' };
  const topic = await Topic.create({
    name: payload.name,
    image: payload.image,
    description: payload.description,
    category: payload.category || 'vocabulary',
    words: []
  });
  return {
    topic: {
      id: topic._id,
      name: topic.name,
      image: topic.image,
      description: topic.description,
      category: topic.category,
      totalWords: topic.totalWords,
      progress: 0,
      learnedWords: 0
    }
  };
};

export const updateTopic = async (id, payload) => {
  const topic = await Topic.findById(id);
  if (!topic) return { reason: 'NOT_FOUND' };
  if (payload.name) topic.name = payload.name;
  if (payload.image) topic.image = payload.image;
  if (payload.description !== undefined) topic.description = payload.description;
  if (payload.category) topic.category = payload.category;
  if (payload.isActive !== undefined) topic.isActive = payload.isActive;
  await topic.save();
  return { topic };
};

export const softDeleteTopic = async (id) => {
  const topic = await Topic.findByIdAndDelete(id);
  if (!topic) return { reason: 'NOT_FOUND' };
  // topic.isActive = false;

  await topic.save();
  return {};
};

export const addWordToTopic = async (topicId, payload) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return { reason: 'NOT_FOUND' };

  topic.words.push({
    english: payload.english,
    vietnamese: payload.vietnamese,
    definition: payload.definition,
    meaning: payload.meaning,
    example: payload.example,
    exampleVN: payload.exampleVN,
    image: payload.image,
    wordType: payload.wordType || 'noun'
  });
  await topic.save();
  return { topic };
};

export const updateWordInTopic = async (topicId, index, payload) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return { reason: 'NOT_FOUND' };
  if (index < 0 || index >= topic.words.length) return { reason: 'WORD_NOT_FOUND' };

  const w = topic.words[index];
  if (payload.english) w.english = payload.english;
  if (payload.vietnamese) w.vietnamese = payload.vietnamese;
  if (payload.definition !== undefined) w.definition = payload.definition;
  if (payload.meaning !== undefined) w.meaning = payload.meaning;
  if (payload.example !== undefined) w.example = payload.example;
  if (payload.exampleVN !== undefined) w.exampleVN = payload.exampleVN;
  if (payload.image !== undefined) w.image = payload.image;
  if (payload.wordType) w.wordType = payload.wordType;

  await topic.save();
  return { topic };
};

export const deleteWordInTopic = async (topicId, index) => {
  const topic = await Topic.findByIdAndDelete(topicId);
  if (!topic) return { reason: 'NOT_FOUND' };
  if (index < 0 || index >= topic.words.length) return { reason: 'WORD_NOT_FOUND' };

  topic.words.splice(index, 1);
  return { topic };
};