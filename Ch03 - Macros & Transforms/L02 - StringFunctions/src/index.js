exports.handler = (event, context, callback) => {
  console.log('event', JSON.stringify(event));
  let fragment,
    status = 'success';
  const {
    requestId,
    params: { Operation, InputString, Chars, Old, New, Length, StripFrom },
  } = event;

  const noParamStringFuncs = [
    'Upper',
    'Lower',
    'Capitalize',
    'Title',
    'SwapCase',
  ];

  if (noParamStringFuncs.includes(Operation)) {
    fragment = operations[Operation.toLowerCase()](InputString);
  } else if (Operation === 'Strip') {
    fragment = strip(InputString, Chars);
  } else if (Operation === 'Replace') {
    fragment = InputString.replace(new RegExp(Old, 'g'), New);
  } else if (Operation === 'MaxLength') {
    if (InputString <= Length) {
      fragment = InputString;
    } else if (StripFrom) {
      if (StripFrom === 'Left') {
        const strLength = InputString.length;
        fragment = InputString.slice(strLength - Length, strLength + 1);
      } else if (StripFrom === 'Right') {
        fragment = InputString.slice(0, Length);
      } else {
        response['status'] = 'failure';
      }
    }
  } else {
    status = 'failure';
  }

  const resp = {
    requestId,
    status,
    fragment,
  };

  callback(null, resp);
};

const upper = str => str.toUpperCase();
const lower = str => str.toLowerCase();
const capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
const title = str =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.replace(word[0], word[0].toUpperCase()))
    .join(' ');
const swapcase = str =>
  str
    .split('')
    .map(c => (c === c.toUpperCase() ? lower(c) : upper(c)))
    .join('');
const strip = (s, c) => {
  if (!c) return s.trim();
  if (c.indexOf(s[0]) > -1) return strip(s.substring(1), c);
  if (c.indexOf(s[s.length - 1]) > -1)
    return strip(s.substring(0, s.length - 1), c);
  return s;
};

const operations = {
  upper,
  lower,
  capitalize,
  title,
  swapcase,
};
