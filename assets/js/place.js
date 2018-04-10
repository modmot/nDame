var canvas = document.getElementById("canvas");
var gc = canvas.getContext("2d");
var width = document.getElementById("canvas").getAttribute("width");
var height = document.getElementById("canvas").getAttribute("height");
var img = document.getElementById("dame");

// time measure (duration)
var start;
var elapsed;

// the Array chess field (0..black, 1..white, 2---dame.jpg
var brett = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];
var size = 64;


// -----------------------------------------------------------------------------
init();


// -----------------------------------------------------------------------------
function init() {
    brett = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    ];

    paint();
}

function start_ndamen() {
    console.log("Los gehts");
    start = new Date().getTime();

    init();

    // START web worker
    var worker = new Worker("./assets/js/worker_ndamen.js");


    // SENDING array data to the worker using a copy memory operation
    slow = input_slow.value;
    worker.postMessage({
        brett: brett,
        slow: slow
    });


    // RECEIVEING 
    // finished: 1|-1, val: val ,y: y ,x:x

    worker.onmessage = function (event) {

        var x = parseInt(event.data.x);
        var y = parseInt(event.data.y);

        brett[y][x] += parseInt(event.data.val);

        if (brett[y][x] == 0) {
            gc.fillStyle = "black";
            gc.fillRect(x * size, y * size, size, size);
        } else if (brett[y][x] == 1) {
            gc.fillStyle = "white";
            gc.fillRect(x * size, y * size, size, size);
        } else {
            gc.drawImage(img, x * size, y * size, 64, 64);
        }

        if (event.data.finished == 1) {
            worker.terminate();
            elapsed = new Date().getTime() - start;
            document.getElementById("duration").innerHTML = "elapsed time " + elapsed + " ms";
            alert("Done!!!");

            return;
        }
    };
}


function paint() {
    for (y = 0; y < 8; y++) { // row
        for (x = 0; x < 8; x++) { // col
            if (brett[y][x] == 0) {
                gc.fillStyle = "black";
                gc.fillRect(x * size, y * size, size, size);
            } else if (brett[y][x] == 1) {
                gc.fillStyle = "white";
                gc.fillRect(x * size, y * size, size, size);
            } else {
                gc.drawImage(img, x * size, y * size, 64, 64);
            }
        }
    }
}