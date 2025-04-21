import express from 'express';
import { addSchool } from '../controllers/addSchool.js';
import { listSchools } from '../controllers/listSchools.js';

const router = express.Router();

router.post('/add-school', addSchool);
router.get('/list-schools', listSchools);

export default router;