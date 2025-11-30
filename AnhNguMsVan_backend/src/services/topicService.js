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
  const topic = await Topic.findById(id);
  if (!topic) return { reason: 'NOT_FOUND' };
  topic.isActive = false;
  await topic.save();
  return {};
};
