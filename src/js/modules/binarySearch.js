/*
 Binary search function simple example
 */

export default function (array, needle) {
  let low = 0;
  let high = array.length - 1;
  let mid;
  let guess;

  while (low <= high) {
    mid = parseInt((low + high) / 2, 10);
    guess = array[mid];
    if (guess === needle) {
      return mid;
    }
    guess > needle ? high = mid - 1 : low = mid + 1;
  }
  return null;
}
