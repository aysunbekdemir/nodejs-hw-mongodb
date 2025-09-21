const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return;
  const isBool = (isFavourite) => ['true', 'false'].includes(isFavourite);

  if (isBool(isFavourite)) return isFavourite === 'true';
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  const filter = {};

  if (parsedType) {
    filter.contactType = parsedType;
  }

  if (parsedIsFavourite !== undefined) {
    filter.isFavourite = parsedIsFavourite;
  }

  return filter;
};
