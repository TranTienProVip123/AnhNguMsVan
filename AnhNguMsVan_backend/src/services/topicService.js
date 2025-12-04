import Topic from '../models/Topic.js';

export const listTopics = async ({ category }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;
  const topics = await Topic.find(filter)
    .select('name image description category totalWords')
    .sort({ createdAt: -1 })
    .lean();

  return topics.map(t => {
    return {
      id: t._id,
      name: t.name,
      image: t.image,
      description: t.description,
      category: t.category,
      totalWords: typeof t.totalWords === 'number' ? t.totalWords : 0,
      progress: t.progress || 0,
      learnedWords: t.learnedWords || 0
    };
  });
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
      progress: topic.progress || 0,
      learnedWords: topic.learnedWords || 0
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
    words: [],
    totalWords: 0
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

// thêm từ vào topic
export const addWordToTopic = async (topicId, payload) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return { reason: 'NOT_FOUND' };

  topic.words.push({
    id: payload._id,
    english: payload.english,
    vietnamese: payload.vietnamese,
    phoneticUS: payload.phoneticUS,
    phoneticUK: payload.phoneticUK,
    definition: payload.definition,
    meaning: payload.meaning,
    example: payload.example,
    exampleVN: payload.exampleVN,
    image: payload.image,
    wordType: payload.wordType || 'noun'
  });
  topic.totalWords = topic.words.length;
  await topic.save();
  return { topic };
};

// cập nhật từ trong topic
// Update a word inside topic
export const updateWordInTopic = async (topicId, wordId, payload) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return { reason: 'NOT_FOUND_TOPIC' };

  const wordIndex = topic.words.findIndex(
    w => w._id && w._id.toString() === wordId
  );

  if (wordIndex === -1) {
    return { reason: 'NOT_FOUND_WORD' };
  }

  const existingWord = topic.words[wordIndex];

  // Update fields (giữ nguyên _id)
  topic.words[wordIndex] = {
    ...existingWord,
    english: payload.english ?? existingWord.english,
    vietnamese: payload.vietnamese ?? existingWord.vietnamese,
    phoneticUS: payload.phoneticUS ?? existingWord.phoneticUS,
    phoneticUK: payload.phoneticUK ?? existingWord.phoneticUK,
    definition: payload.definition ?? existingWord.definition,
    meaning: payload.meaning ?? existingWord.meaning,
    example: payload.example ?? existingWord.example,
    exampleVN: payload.exampleVN ?? existingWord.exampleVN,
    image: payload.image ?? existingWord.image,
    wordType: payload.wordType ?? existingWord.wordType
  };

  await topic.save();
  return { word: topic.words[wordIndex] };
};

// xóa từ khỏi topic
// Delete a word inside topic
export const deleteWordInTopic = async (topicId, wordId) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return { reason: 'NOT_FOUND_TOPIC' };

  const wordIndex = topic.words.findIndex(
    w => w._id && w._id.toString() === wordId
  );

  if (wordIndex === -1) {
    return { reason: 'NOT_FOUND_WORD' };
  }

  const deletedWord = topic.words[wordIndex];

  topic.words.splice(wordIndex, 1);
  topic.totalWords = topic.words.length;
  await topic.save();

  return { deletedWord, remaining: topic.words.length };
};
