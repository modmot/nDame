var brett;
var slow;

// --------------------------------------------------
self.onmessage = (event) => {
  // receive input data
  // { brett: brett , slow: slow};
  brett = event.data.brett;
  slow = parseInt(event.data.slow);

  // start the algo for the first dame
  backtrack(0);
}


// --------------------------------------------------
var backtrack = i => {
  // function backtrack(i) { // i-th Dame
  console.log("backtrack: Queen Nr= " + i);

  // i-th Queen in (maybe) all cols
  for (var k = 0; k <= 7; k++) {
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
      if (i == 7) { // we got done: last
        postMessage({
          finished: 1,
          val: 2,
          y: i,
          x: k
        });
        self.close();
        return true;
      } else {

        // try next row
        var ready = backtrack(i + 1);

        if (ready)
          return ready;
        else { // no: this k is not good
          // devare queen from i,k
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
      }
    }
    console.log("try next column= " + k);
  }
  return false;
}


var isInDanger = (i, j) => {
  var col, row;
  var iorig, jorig;

  iorig = i;
  jorig = j;
  // check row
  for (col = 0; col < 8; ++col) {
    if (brett[i][col] > 1) { // queen already here
      return true;
    }
  }

  // check col
  for (row = 0; row < 8; ++row) {
    if (brett[row][j] > 1) { // queen already here
      return true;
    }
  }

  // diag  "/"
  // --
  while (i >= 0 && j < 8) {
    if (brett[i][j] > 1) // queen already here
      return true;
    else {
      i--;
      j++; // right and up
    }
  }

  // ++
  i = iorig;
  j = jorig;
  while (i < 8 && j >= 0) {
    if (brett[i][j] > 1) // queen already here
      return true;
    else {
      i++;
      j--; // left and down
    }
  }

  // diag "\\"
  //
  i = iorig;
  j = jorig;
  while (i >= 0 && j >= 0) {
    if (brett[i][j] > 1) // queen already here
      return true;
    else {
      i--;
      j--; // left and up
    }
  }


  //
  i = iorig;
  j = jorig;
  while (i < 8 && j < 8) {
    if (brett[i][j] > 1) // queen already here
      return true;
    else {
      i++;
      j++; // right and down
    }
  }

  return false;
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}