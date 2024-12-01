import { Router } from 'express';
import {
  getContactsController,
  getContactsByIdController,
  addContactsController,
  deleteContactsController,
  upsertContactsController,
  updateContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { addContactsSchema, updateContactsSchema } from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

import validateBody from '../middlewares/validateBody.js';
import { upload } from '../middlewares/upload.js';



const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id',isValidId, ctrlWrapper(getContactsByIdController));

router.post('/',upload.single("photo"), validateBody(addContactsSchema), ctrlWrapper(addContactsController));

router.delete('/:id',isValidId, ctrlWrapper(deleteContactsController));

router.put('/:id',upload.single("photo"),isValidId, validateBody(addContactsSchema),ctrlWrapper(upsertContactsController));

router.patch('/:id',upload.single("photo"),isValidId, validateBody(updateContactsSchema), ctrlWrapper(updateContactsController));



export default router;
