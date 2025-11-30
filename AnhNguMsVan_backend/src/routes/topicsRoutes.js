import { Router } from 'express';
import { getTopics, getTopic } from '../controllers/topicController.js';
import { listTopicValidator, getTopicValidator } from '../validations/topicValidation.js';

const router = Router();

router.get('/', listTopicValidator, getTopics);
router.get('/:id', getTopicValidator, getTopic);

export default router;
