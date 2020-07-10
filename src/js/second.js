import './common';
import '../templates/second.pug';

export default function Main() {
  console.log('second');
  const tst = function test() {
    return 'test';
  };

  console.log(tst());
}

Main();
