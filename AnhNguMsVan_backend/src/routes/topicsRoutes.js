import { Router } from 'express';
import { getTopics, getTopic } from '../controllers/topicController.js';
import { listTopicValidator, getTopicValidator } from '../validations/topicValidation.js';

const router = Router();


router.get('/', listTopicValidator, getTopics);
router.get('/:id', getTopicValidator, getTopic);

// PUT: Cập nhật word trong topic
// router.put('/:topicId/words/:wordId', async (req, res) => {
//   try {
//     const { topicId, wordId } = req.params;
//     const { english, vietnamese, definition, meaning, example, exampleVN, image, wordType } = req.body;

//     // console.log('Update word - topicId:', topicId, 'wordId:', wordId); // Debug log

//     const topic = await Topic.findById(topicId);
//     if (!topic) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy chủ đề'
//       });
//     }

//     // console.log('Topic found, total words:', topic.words.length); // Debug log

//     // Tìm word theo _id
//     const wordIndex = topic.words.findIndex(w => {
//       console.log('Checking word:', w._id ? w._id.toString() : 'NO ID'); // Debug log
//       return w._id && w._id.toString() === wordId;
//     });

//     // console.log('Word index found:', wordIndex); // Debug log

//     if (wordIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy từ vựng',
//         debug: {
//           wordId,
//           availableIds: topic.words.map(w => w._id ? w._id.toString() : 'NO_ID')
//         }
//       });
//     }

//     // Cập nhật word - Giữ nguyên _id
//     const existingWord = topic.words[wordIndex];
//     topic.words[wordIndex] = {
//       _id: existingWord._id, // ← Quan trọng: giữ lại _id
//       english: english || existingWord.english,
//       vietnamese: vietnamese || existingWord.vietnamese,
//       definition: definition !== undefined ? definition : existingWord.definition,
//       meaning: meaning !== undefined ? meaning : existingWord.meaning,
//       example: example !== undefined ? example : existingWord.example,
//       exampleVN: exampleVN !== undefined ? exampleVN : existingWord.exampleVN,
//       image: image || existingWord.image,
//       wordType: wordType || existingWord.wordType
//     };

//     await topic.save();

//     res.json({
//       success: true,
//       message: 'Cập nhật từ vựng thành công',
//       data: topic.words[wordIndex]
//     });
//   } catch (error) {
//     console.error('Error updating word:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi cập nhật từ vựng',
//       error: error.message
//     });
//   }
// });

// // Delete word khỏi topic
// router.delete('/:topicId/words/:wordId', async (req, res) => {
//   try {
//     const { topicId, wordId } = req.params;

//     // console.log('Delete word - topicId:', topicId, 'wordId:', wordId);

//     const topic = await Topic.findById(topicId);
//     if (!topic) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy chủ đề'
//       });
//     }

//     const wordIndex = topic.words.findIndex(w => 
//       w._id && w._id.toString() === wordId
//     );

//     if (wordIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy từ vựng'
//       });
//     }

//     // Lưu lại thông tin word trước khi xóa
//     const deletedWord = topic.words[wordIndex];

//     // Xóa word khỏi array
//     topic.words.splice(wordIndex, 1);

//     await topic.save();

//     res.json({
//       success: true,
//       message: 'Xóa từ vựng thành công',
//       data: {
//         deletedWord,
//         remainingWords: topic.words.length
//       }
//     });
//   } catch (error) {
//     console.error('Error deleting word:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi xóa từ vựng',
//       error: error.message
//     });
//   }
// });

export default router;
