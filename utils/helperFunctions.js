const removeLastCommaBeforeWhere = (str) => {
  const splittedStr = str.split(' ');
  const indx = splittedStr.indexOf('WHERE');
  const findAndRemoveComma = splittedStr[indx - 1]
    .split('')
    .slice(0, 2)
    .join('');

  splittedStr[indx - 1] = findAndRemoveComma;

  return splittedStr.join(' ');
};

module.exports = { removeLastCommaBeforeWhere };
