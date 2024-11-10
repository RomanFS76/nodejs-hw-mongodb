import { contactTypeList } from '../constants/contacts.js';

const parseContactType = (contactType) => {
  if (typeof contactType !== 'string') return;

  const isContactType = (contactType) => contactTypeList.includes(contactType);
  if (isContactType(contactType)) {
    return contactType;
  }
};

const parseIsFavourite = (favourite) => {
  return favourite === 'true' ? true : favourite === 'false' ? false : undefined;
};

export const parseFilterParams = ({ contactType, isFavourite }) => {
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
