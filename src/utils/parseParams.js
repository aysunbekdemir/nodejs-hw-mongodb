const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseInt(page);
  const parsedPerPage = parseInt(perPage);

  const pageAsNumber =
    !Number.isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const perPageAsNumber =
    !Number.isNaN(parsedPerPage) && parsedPerPage > 0 ? parsedPerPage : 10;

  return {
    page: pageAsNumber,
    perPage: perPageAsNumber,
  };
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortOrder =
    sortOrder && Object.values(SORT_ORDER).includes(sortOrder.toLowerCase())
      ? sortOrder
      : SORT_ORDER.ASC;

  return {
    sortBy: sortBy || '_id',
    sortOrder: parsedSortOrder,
  };
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;
  const filter = {};

  if (contactType) {
    filter.contactType = contactType;
  }

  if (['true', 'false'].includes(isFavourite)) {
    filter.isFavourite = isFavourite === 'true';
  }

  return filter;
};
