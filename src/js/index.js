import './common';
import binarySearch from './modules/binarySearch';
import '../templates/index.pug';

export default function Main() {
  const needle = 5;
  const array = [1, 3, 5, 6, 8, 22, 70, 71, 88];

  console.log(`Binary search ${needle} in [${array.toString()}]`);
  console.log(`Result ${binarySearch(array, needle)}`);
}

Main();
