var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;
var abs = Math.abs;
var sqrt = Math.sqrt;
var pow = Math.pow;

var c = document.getElementById("canvas").getContext("2d");

c.cam = {
    x: 0,
    y: 0,
    z: 0,
    rot: {
        x: 0,
        y: 0,
        z: 0
    }
};

c.normal = function(pts){
    var a = {
        x: pts[0].x - pts[2].x,
        y: pts[0].y - pts[2].y,
        z: pts[0].z - pts[2].z
    };
    var b = {
        x: pts[1].x - pts[2].x,
        y: pts[1].y - pts[2].y,
        z: pts[1].z - pts[2].z
    };
    var i = a.y * b.z - a.z * b.y;
    var j = a.z * b.x - a.x * b.z;
    var k = a.x * b.y - a.y * b.x;
    var m = Math.sqrt(i * i + j * j + k * k);
    return k / m;
};

c.orient = function(pt){
    var temp = {};
    temp.sx = pt.x * c.cos.z - pt.y * c.sin.z;
    temp.sy = pt.y * c.cos.z + pt.x * c.sin.z;
    temp.x = temp.sx * c.cos.y - pt.z * c.sin.y;
    temp.z = pt.z * c.cos.y + temp.sx * c.sin.y;
    temp.y = temp.sy * c.cos.x - temp.z * c.sin.x;
    temp.z = temp.z * c.cos.x + temp.sy * c.sin.x;
    temp.x -= c.cam.x;
    temp.y -= c.cam.y;
    temp.z -= c.cam.z;
    delete temp.sx;
    delete temp.sy;
    return temp;
};

c.to2D = function(pt){
    return {
        x: pt.x / pt.z * c.canvas.width + c.canvas.width / 2,
        y: pt.y / pt.z * c.canvas.width + c.canvas.height / 2,
        z: 0,
        buffer: pt.z
    }
};

c.rect3D = function(i0, i1, i2, i3, color){
    c.triangles.push(new triangle(i0, i1, i2, color));
    c.triangles.push(new triangle(i2, i3, i0, color));
};

var point = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
};

var triangle = function(i1, i2, i3, color){
    this.i1 = i1;
    this.i2 = i2;
    this.i3 = i3;
    this.color = color;
};

var rgb = function(r, g, b){
    this.r= r;
    this.g= g;
    this.b= b;
    this.coerce = function(){
        this.r = Math.round(Math.max(0, Math.min(255, this.r)));
        this.g = Math.round(Math.max(0, Math.min(255, this.g)));
        this.b = Math.round(Math.max(0, Math.min(255, this.b)));
        return this;
    };
    this.lighting = function(n, a){
        this.r = (this.r + a) * -n;
        this.g = (this.g + a) * -n;
        this.b = (this.b + a) * -n;
        return this.coerce();
    }
};

c.draw3DTriangle = function(tri){
    var pts = [
        c.oriented[tri.i1],
        c.oriented[tri.i2],
        c.oriented[tri.i3]
    ];
    var n = c.normal(pts) / 1.25;
    var s = new rgb(tri.color.r, tri.color.g, tri.color.b);
    s.lighting(n, 50);
    c.fillStyle = "rgba(" + s.r + ", " + s.g + ", " + s.b + ", 1)";
    c.lineWidth = 1;
    c.strokeStyle = (!c.wireFrame) ? c.fillStyle :  "rgb(0,0,0)";
    c.beginPath();
    c.moveTo(c.pts2D[tri.i1].x, c.pts2D[tri.i1].y);
    c.lineTo(c.pts2D[tri.i2].x, c.pts2D[tri.i2].y);
    c.lineTo(c.pts2D[tri.i3].x, c.pts2D[tri.i3].y);
    c.lineTo(c.pts2D[tri.i1].x, c.pts2D[tri.i1].y);
    c.closePath();
    c.fill();
    c.stroke();
};

c.pts = [];
c.triangles = [];
c.pts2D = [];
c.wireFrame = false;

var getFunction = function(){
    var eq = document.getElementById("eq").value;
    eval("var x = function(x,y){return " + eq + ";};");
    return x;
};

c.makePlane = function(p, r, res, color){
    if(!r.hasOwnProperty("x")) r = {x: r, y: r};
    var l = c.pts.length;
    for(var i = 0; i < res; i++){
        for(var n = 0; n < res; n++){
            c.pts.push(new point(p.x + r.x * (2 * i / (res - 1) - 1), p.y + r.y * (2 * n / (res - 1) - 1), p.z));
            if(n * i > 0){
                c.rect3D(l + res * (i - 1) + (n - 1), l + res * (i - 1) + n, l + res * i  + n, l + res * i + n - 1, color);
                c.rect3D(l + res * i + n - 1, l + res * i  + n, l + res * (i - 1) + n, l + res * (i - 1) + (n - 1), color);
            }
        }
    }
};
c.makeEquation = function(eq, sx, sy, ex, ey, step, color){
    var l = c.pts.length;
    var i = 0;
    var res = (ex - sx) / step;
    for(var x = sx; x < ex; x+=step){
        var n = 0;
        for(var y = sy; y < ey; y+=step){
            var z = eq(x, y);
            c.pts.push(new point(x, y, z));
            if(n * i > 0){
                c.rect3D(l + res * n + i, l + res * n + i - 1, l + res * (n - 1) + i - 1, l + res * (n - 1) + i, color);
                c.rect3D(l + res * (n - 1) + i, l + res * (n - 1) + i - 1, l + res * n + i - 1, l + res * n + i, color);
            }
            n++;
        }
        i++;
    }
};
c.makeCube = function(p, r, color){
    if(!r.hasOwnProperty("x")) r = {x: r, y: r, z: r};
    var l = c.pts.length;
    c.pts.push(new point(p.x - r.x, p.y - r.y, p.z + r.z));
    c.pts.push(new point(p.x + r.x, p.y - r.y, p.z + r.z));
    c.pts.push(new point(p.x + r.x, p.y + r.y, p.z + r.z));
    c.pts.push(new point(p.x - r.x, p.y + r.y, p.z + r.z));
    c.pts.push(new point(p.x - r.x, p.y - r.y, p.z - r.z));
    c.pts.push(new point(p.x + r.x, p.y - r.y, p.z - r.z));
    c.pts.push(new point(p.x + r.x, p.y + r.y, p.z - r.z));
    c.pts.push(new point(p.x - r.x, p.y + r.y, p.z - r.z));
    c.rect3D(3 + l, 2 + l, 1 + l, l, color);
    c.rect3D(l, 1 + l, 5 + l, 4 + l, color);
    c.rect3D(4 + l, 7 + l, 3 + l, l, color);
    c.rect3D(1 + l, 2 + l, 6 + l, 5 + l, color);
    c.rect3D(5 + l, 6 + l, 7 + l, 4 + l, color);
    c.rect3D(2 + l, 3 + l, 7 + l, 6 + l, color);
};
c.makeCylinder = function(p, r, h, color){
    var l = c.pts.length;
    c.pts.push(new point(p.x, p.y, p.z + h/2));
    for(var i = 0; i < 2 * Math.PI; i += Math.PI / 36){
        c.pts.push(new point(p.x - r * Math.cos(i), p.y - r * Math.sin(i), p.z + h / 2));
        if(i > 0)
            c.triangles.push(new triangle(l, c.pts.length - 1, c.pts.length - 2, color));
    }
    var le = c.pts.length;
    c.pts.push(new point(p.x, p.y, p.z - h/2));
    for(i = 0; i < 2 * Math.PI; i += Math.PI / 36){
        c.pts.push(new point(p.x - r * Math.cos(i), p.y - r * Math.sin(i), p.z - h / 2));
        if(i > 0)
            c.triangles.push(new triangle(le, c.pts.length - 2, c.pts.length - 1, color));
    }
    for(i = 1; i < 73; i++){
        c.rect3D(l + i, l + i + 1, le + i + 1, le + i, color);
    }
};
c.makeSphere = function(p, r, color){
    var l = c.pts.length;
    c.pts.push(new point(p.x, p.y, p.z + r));
    for(var i = Math.PI / 18; i < Math.PI * 17 / 18; i += Math.PI / 18){
        if(i > Math.PI * 8.4 / 9){
            l = c.pts.length;
            c.pts.push(new point(p.x, p.y, p.z - r));
        }
        for(var n = 0; n < 2 * Math.PI; n += Math.PI / 18){
            c.pts.push(new point(p.x + Math.sin(i) * Math.cos(n) * r, p.y + Math.sin(i) * Math.sin(n) * r, p.z + Math.cos(i) * r));
            if(n > 0){
                if(i < Math.PI * 1.5 / 18)
                    c.triangles.push(new triangle(l, c.pts.length - 1, c.pts.length - 2, color));
                else{
                    if(i > Math.PI * 8.4 / 9){
                        c.triangles.push(new triangle(l, c.pts.length - 2, c.pts.length - 1, color));
                        c.rect3D(c.pts.length - 1, c.pts.length - 2, c.pts.length - 40, c.pts.length - 39, color);
                    }else
                        c.rect3D(c.pts.length - 1, c.pts.length - 2, c.pts.length - 39, c.pts.length - 38, color);
                }
            }
        }
    }
};

function reset(){
    c.pts = [];
    c.triangles = [];
    c.pts2D = [];
    c.canvas.width = document.documentElement.clientWidth;
    c.canvas.height = document.documentElement.clientHeight;
}

function data(){
    reset();
    var color = new rgb(0, 0, 255);
    c.makeEquation(getFunction(), -5, -5, 5, 5, .5, color);
}
function cube(){
    reset();
    var color = new rgb(255, 0, 0);
    c.makeCube(new point(0, 0, 0), 4, color);
}
function sphere(){
    reset();
    var color = new rgb(0, 255, 255);
    c.makeSphere(new point(.5, 0, -.5), 4, color);
}
function cylinder(){
    reset();
    color = new rgb(0, 255, 0);
    c.makeCylinder(new point(0, 0, 0), 3, 10, color);
}
data();
c.cam.z = 40;
c.cam.rot.z = Math.PI / 4;
c.cam.rot.x = - Math.PI / 6;

var x = function(){
    c.frame = (c.hasOwnProperty('frame')) ? c.frame + 1 : 0;
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    c.pts2D = [];
    c.oriented = [];
    c.cos = {
        x: Math.cos(c.cam.rot.x),
        y: Math.cos(c.cam.rot.y),
        z: Math.cos(c.cam.rot.z)
    };
    c.sin = {
        x: Math.sin(c.cam.rot.x),
        y: Math.sin(c.cam.rot.y),
        z: Math.sin(c.cam.rot.z)
    };
    for(var i = 0; i < c.pts.length; i++){
        c.oriented.push(c.orient(c.pts[i]));
        c.pts2D.push(c.to2D(c.oriented[i]));
    }
    c.triangles.sort(function(a, b){
        var bufferA = (c.pts2D[a.i1].buffer + c.pts2D[a.i2].buffer + c.pts2D[a.i3].buffer) / 3;
        var bufferB = (c.pts2D[b.i1].buffer + c.pts2D[b.i2].buffer + c.pts2D[b.i3].buffer) / 3;
        return bufferA - bufferB;
    });
    for(i = 0; i < c.triangles.length; i++){
        var pts2D = [
            c.pts2D[c.triangles[i].i1],
            c.pts2D[c.triangles[i].i2],
            c.pts2D[c.triangles[i].i3]
        ];
        if(c.normal(pts2D) < 0){
            c.draw3DTriangle(c.triangles[i]);
        }
    }
};

c.canvas.onmousedown = function(e){c.down = true;c.offset = [c.cam.rot.z, c.cam.rot.x, e.clientX, e.clientY]};
c.canvas.onmouseup = function(){c.down = false;};
c.canvas.onmousemove = function(e){
    if(c.down){
        c.cam.rot.z = c.offset[0] - (e.clientX - c.offset[2]) * Math.PI * 2/ c.canvas.width;
        c.cam.rot.x = c.offset[1] - (e.clientY - c.offset[3]) * Math.PI * 2/ c.canvas.width;
    }
    x();
};

setInterval(function(){
    if(!c.down){
        c.cam.rot.z += .05;
        x();
    }
}, 50);

document.getElementById("eq").addEventListener("change", data);