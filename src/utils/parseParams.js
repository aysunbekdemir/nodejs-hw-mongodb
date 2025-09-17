const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const parsePaginationParams = ({ page, perPage }) => {
  const parsedPage = parseInt(page, 10);
  const parsedPerPage = parseInt(perPage, 10);

  return {
    page: isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage,
    perPage: isNaN(parsedPerPage) || parsedPerPage <= 0 ? 10 : parsedPerPage,
  };
};

const parseSortParams = ({ sortBy, sortOrder }) => {
  const order = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';
  return {
    sortBy: sortBy || '_id',
    sortOrder: order,
  };
};

const parseFilterParams = ({ contactType, isFavourite }) => {
  const filter = {};
  if (['work', 'home', 'personal'].includes(contactType)) {
    filter.contactType = contactType;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }
  return filter;
};

export { parsePaginationParams, parseSortParams, parseFilterParams };
