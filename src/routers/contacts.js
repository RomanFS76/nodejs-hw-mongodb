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
import validateBody from '../utils/validateBody.js';
import { addContactsSchema, updateContactsSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id',isValidId, ctrlWrapper(getContactsByIdController));

router.post('/', validateBody(addContactsSchema), ctrlWrapper(addContactsController));

router.delete('/:id',isValidId, ctrlWrapper(deleteContactsController));

router.put('/:id',isValidId, validateBody(addContactsSchema),ctrlWrapper(upsertContactsController));

router.patch('/:id',isValidId, validateBody(updateContactsSchema), ctrlWrapper(updateContactsController));



export default router;
