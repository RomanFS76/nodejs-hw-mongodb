export const calculatePaginationData = ({ totalItems, page, perPage }) => {
  // console.log(totalItems)
  // console.log(page)
  // console.log(perPage)

  const totalPages = Math.ceil(totalItems / perPage);

  const hasNextPage = page < totalPages;
  const hasNPrevPage = page > 1;
  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasNPrevPage,
  };
};
