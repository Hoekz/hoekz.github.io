var modulus = {
    length: 0,
    lengths: [],
    count: 1,
    last: 0,
    mod: 2,
    display: document.getElementById("modulus")
};
var canvas = document.getElementById("canvas");
var slopes = document.getElementById("slopes");
modulus.display.innerHTML = "";
for(modulus.mod = 2; modulus.mod < 2001; modulus.mod++){
    modulus.count = 1;
    modulus.last = 0;
    modulus.length = 0;
    while(!(modulus.count == 0 && modulus.last == 1)){
        modulus.length++;
        modulus.count = (modulus.count + modulus.last);
        modulus.last = (modulus.count - modulus.last) % modulus.mod;
        modulus.count %= modulus.mod;
    }
    modulus.lengths.push(modulus.length + 1);
    if(modulus.mod < 502){
        modulus.display.innerHTML +='<div class="hold" onclick="showSeries('+modulus.mod+')">'+
            modulus.mod + ': ' + (modulus.length + 1) +
            '</div>';
    }
}
graph(1,1);
graphSlopes();

function showSeries(mod){
    modulus.count = 1;
    modulus.last = 0;
    modulus.length = [];
    while(!(modulus.count == 0 && modulus.last == 1)){
        modulus.length.push(modulus.count);
        modulus.count = (modulus.count + modulus.last);
        modulus.last = (modulus.count - modulus.last) % mod;
        modulus.count %= mod;
    }
    modulus.length.push(0);
    document.getElementById("series").innerHTML = modulus.length.join(", ");
}

function graph(x, y){
    var context = canvas.getContext("2d");
    var height = parseInt(canvas.height);
    var width = parseInt(canvas.width);
    context.clearRect(0, 0, width, height);
    var max = Math.max.apply(null, modulus.lengths);
    var slope = (max * (1 - y / height)) / (x * modulus.lengths.length / width + .00001);
    context.lineWidth = 1;
    context.lineCap = "round";
    context.translate(.5,.5);
    var total = 0;
    for(var i = 0; i < modulus.lengths.length; i++){
        var s = modulus.lengths[i] / (i + 2);
        context.beginPath();
        switch(Math.round(s * 10) / 10){
            case 1:
                context.strokeStyle = "red";
                break;
            case 2:
                context.strokeStyle = "green";
                break;
            case 3:
                context.strokeStyle = "blue";
                break;
            default:
                context.strokeStyle = "black";
                break;
        }
        context.strokeStyle = (Math.abs(slope - s) < .1) ? "cyan" : context.strokeStyle;
        total += (Math.abs(slope - s) < .1) ? 1 : 0;
        context.moveTo((i * width)/modulus.lengths.length, height);
        context.lineTo((i * width)/modulus.lengths.length, height - ((modulus.lengths[i] * height)/max));
        context.closePath();
        context.stroke();
    }
    context.translate(-.5,-.5);
    document.getElementById("slope").innerHTML = "slope of " + (Math.round(slope * 100) / 100) +
        " results in " + total + " lines";
}

function graphSlopes(){
    var frequencies = [];
    for(var n = 0; n < 5; n+=.005){
        var total = 0;
        for(var i = 0; i < modulus.lengths.length; i++){
            var s = modulus.lengths[i] / (i + 2);
            total += (Math.abs(n - s) < .005) ? 1 : 0;
        }
        frequencies.push(total);
    }
    var context = slopes.getContext("2d");
    var width = slopes.width;
    var height = slopes.height;
    var max = Math.max.apply(null, frequencies);
    context.beginPath();
    context.moveTo(0, height);
    for(var i = 0; i < frequencies.length; i++){
        context.lineTo((i * width)/frequencies.length, height - ((frequencies[i] * height)/max));
    }
    context.closePath();
    context.stroke();
    context.fillStyle = "red";
    context.fill();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    graph(mousePos.x, mousePos.y);
}, false);

slopes.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(slopes, evt);
    var show = document.getElementById("xpos").innerHTML = "slope of " + (mousePos.x * 5 / slopes.width) + " with a tolerance of .005";
}, false);

function goTo(id, torf){
    if(id == "series"){
        document.getElementById(id).style.display = 'inline';
        document.getElementById("modulus").style.display = 'inline';
    }
    document.getElementById(id).scrollIntoView(torf);
}

document.getElementById("series").style.display = 'none';
document.getElementById("modulus").style.display = 'none';