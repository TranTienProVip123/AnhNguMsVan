import mongoose from 'mongoose';
import Topic from '../models/Topic.js';
import UserProgress from '../models/UserProgress.js';

const syncAllProgress = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const allProgress = await UserProgress.find();

    for (const progress of allProgress) {
      const topic = await Topic.findById(progress.topicId);
      
      if (topic) {
        const currentTotalWords = topic.words?.length || 0;
        
        progress.totalWordsInTopic = currentTotalWords;
        
        if (currentTotalWords > 0) {
          progress.completionRate = Math.round(
            (progress.totalWordsLearned / currentTotalWords) * 100
          );
        } else {
          progress.completionRate = 0;
        }
        
        await progress.save();
        console.log(`✅ Synced progress for topic: ${topic.name}`);
      }
    }

    console.log('🎉 Sync completed!');
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

syncAllProgress();