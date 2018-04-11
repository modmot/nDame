/* eslint-disable */
let brett;
let slow;

// --------------------------------------------------
self.onmessage = (event) => {
  // receive input data
  // { brett: brett , slow: slow};
  brett = event.data.brett;
  slow = parseInt(event.data.slow);

  // start the algo for the first dame
  backtrack(0);
};


// --------------------------------------------------
let backtrack = (i) => {
  // function backtrack(i) { // i-th Dame
  console.log('backtrack: Queen Nr= ' + i);

  // i-th Queen in (maybe) all cols
  for (let k = 0; k <= 7; k + 1) {
    // console.log(k);


    if (!isInDanger(i, k)) {
      // not in danger, so use this column k
      brett[i][k] += 2;
      // send row and col to caller to paint the queen on the canvas
      postMessage({
        finished: -1,
        val: 2,
        y: i,
        x: k
      });
      wait(slow);

      // check END of REcursion
      if (i === 7) { // we got done: last
        postMessage({
          finished: 1,
          val: 2,
          y: i,
          x: k
        });
        self.close();
        return true;
      }

      // try next row
      const ready = backtrack(i + 1);

      if (ready) {
        return ready;
      }
      // no: this k is not good
      // delete queen from i,k
      brett[i][k] -= 2;
      // inform caller
      postMessage({
        finished: -1,
        val: -2,
        y: i,
        x: k
      });
      wait(slow);
    }
    console.log(`try next column= ${  k}`);
  }
  return false;
};


let isInDanger = (i, j) => {
  let col;
  let row;
  let iorig = i;
  let jorig = j;

  // check row
  for (col = 0; col < 8; col + 1) {
    if (brett[i][col] > 1) { // queen already here
      return true;
    }
  }

  // check col
  for (row = 0; row < 8; row + 1) {
    if (brett[row][j] > 1) { // queen already here
      return true;
    }
  }

  // diag  "/"
  // --
  while (i >= 0 && j < 8) {
    if (brett[i][j] > 1) { // queen already here
      return true;
    }
    i -= 1;
    j += 1; // right and up
  }

  // ++
  i = iorig;
  j = jorig;
  while (i < 8 && j >= 0) {
    if (brett[i][j] > 1) { // queen already here
      return true;
    }
    i += 1;
    j -= 1; // left and down
  }
  // diag "\\"
  //
  i = iorig;
  j = jorig;
  while (i >= 0 && j >= 0) {
    if(brett[i][j] > 1) { // queen already here
      return true;
    }
    i -= 1;
    j -= 1; // left and up
  }
  //
  i = iorig;
  j = jorig;
  while (i < 8 && j < 8) {
    if(brett[i][j] > 1) { // queen already here
      return true;
    }
    i += 1;
    j += 1; // right and down
  }

  return false;
};

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
