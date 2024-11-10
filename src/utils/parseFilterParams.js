import { contactTypeList } from '../constants/contacts.js';

const parseContactType = (contactType) => {
  if (typeof contactType !== 'string') return;

  const isContactType = (contactType) => contactTypeList.includes(contactType);
  if (isContactType(contactType)) {
    return contactType;
  }
};

const parseIsFavourite = (favourite) => {
  if (typeof favourite !== 'string') return;
  if (favourite === 'false') return false;
  if (favourite === 'true') return true;
  console.log(favourite)
};

export const parseFilterParams = ({ contactType, isFavourite }) => {
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
