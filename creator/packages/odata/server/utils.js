// like _.min
export function min(arr) {
  return arr.map(item => +item)
    .filter(item => Number.isInteger(item))
    .reduce((current, next) => (current < next ? current : next));
}

function merge(list) {
  return list.join(' ').trim();
}

/**
 * split by multiple keywords in a sentence
 *
 * @example
   split('Price le 200 and Price gt 3.5 or length(CompanyName) eq 19', ['and', 'or'])

   [
     'Price le 200',
     'and',
     'Price gt 3.5',
     'or',
     'length(CompanyName) eq 19'
   ]
*/
export function split(sentence, keys = []) {
  let keysArray = keys;
  if (!(keysArray instanceof Array)) {
    keysArray = [keysArray];
  }
  const result = [];
  let tmp = [];
  const words = sentence.split(' ');
  words.forEach((word) => {
    if (keysArray.indexOf(word) > -1) {
      result.push(merge(tmp));
      result.push(word);
      tmp = [];
    } else {
      tmp.push(word);
    }
  });
  result.push(merge(tmp));
  return result;
}
