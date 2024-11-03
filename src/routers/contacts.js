import { Router } from 'express';
import {
  getContactsController,
  getContactsByIdController,
  addContactsController,
  deleteContactsController,
  upsertContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', ctrlWrapper(getContactsByIdController));

router.post('/', ctrlWrapper(addContactsController));

router.delete('/:id', ctrlWrapper(deleteContactsController));

router.put('/:id', ctrlWrapper(upsertContactsController));



export default router;
