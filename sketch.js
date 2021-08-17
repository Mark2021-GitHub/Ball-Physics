let ball; // Declare object
let balls = [];
let numBalls; // arrary count;
let bounce, fire;
let cnv;
let isFire, isStart;
let dV;
let spring = 0.05;
let gravity = 9.8 / 60;
let friction = 0.01;
let cb1;
let mul = 10;
let pV;

let rx = 0,ry = 0, rz = 0;

function setup() {
  frameRate(60);
  cnv = createCanvas(460, 400, WEBGL);
  cnv.mousePressed(setBall); // attach

  numBalls = 0;
 
  cb1 = createCheckbox("Ball fill", false);
  cb1.position(10, height + 10);
  cb4 = createCheckbox("Ball stroke", true);
  cb4.position(cb1.x + 100, cb1.y);

  cb2 = createCheckbox("Show Speed Vector", false);
  cb2.position(cb1.x, cb1.y + 20);
  cb3 = createCheckbox("Show Collision Vector", true);
  cb3.position(cb2.x, cb2.y + 20);
  cb5 = createCheckbox("Show Distance Line", false);
  cb5.position(cb3.x + 200, cb3.y);

  sl1 = createSlider(20, 100, 100, 10);
  sl1.position(cb3.x, cb3.y + 20);
  dv1 = createDiv("Ball Diemeter: 20-70");
  dv1.style("font-size", "16px");
  dv1.position(sl1.x + 150, sl1.y);
  sl1.changed(PrintDV1);

  sl2 = createSlider(0, 20, 10, 1);
  sl2.position(cb2.x +200, cb2.y );
  dv2 = createDiv("Ball's Z Speed:0");
  dv2.style("font-size", "16px");
  dv2.position(sl2.x + 140, sl2.y);
  sl2.changed(PrintDV2);
  
  sl3 = createSlider(0, 255, 0, 1);
  sl3.position(cb1.x +200, cb1.y );
  dv3 = createDiv("BgColor:128");
  dv3.style("font-size", "16px");
  dv3.position(sl3.x + 140, sl3.y);
  sl3.changed(PrintDV3);

  helpDiv = createDiv("[SpaceBar]:pause/resume [r]:redraw [Arrow]:RotateX,Y [z,x]:RotateZ");
  helpDiv.style("font-size", "16px");
  helpDiv.position(sl1.x , sl1.y+29);
  
  cb6 = createCheckbox("Console Logging", false);
  cb6.position(helpDiv.x, helpDiv.y + 20);

  pV = createVector(100, 100, 50);
}

function PrintDV1() {
  let s1 = sl1.value();
  let s2 = s1 + 50;
  dv1.html("Ball Diemeter: " + s1 + "-" + s2, false);
}

function PrintDV2() {
  let s1 = sl2.value();
  dv2.html("Ball's Z speed:" + s1, false);
}

function PrintDV3() {
  let s1 = sl3.value();
  dv3.html("BgColor:"+ s1, false);
}


function draw() {
  
  background(sl3.value());
  
  if (keyIsPressed === true) {
    if (keyCode == LEFT_ARROW) {
      ry--;
    } else if (keyCode == RIGHT_ARROW) {
      ry++;
    } else if (keyCode == UP_ARROW) {
      rx++;
    } else if (keyCode == DOWN_ARROW) {
      rx--;
    } else if (key == "z") {
      rz--;
    } else if (key == "x") {
      rz++;
    }
  }
  
  rotateX(radians(rx));
  rotateY(radians(ry));
  rotateZ(radians(rz));
  
  // Draw 3D Box;
  noFill();
  stroke(255,0,0);
  box(width,height,width*2);
  
 
  push();
  translate(-width / 2, -height / 2, 0);

  
    
  for (let i = 0; i < numBalls; i++) {
    balls[i].collide();
    //balls[i].moveFloor();
    balls[i].freeFall();
    balls[i].display();
  }
  pop();
}

function setBall() {
  // Create freeFall object
  let bsize = sl1.value();
  balls[numBalls] = new Ball3D(
    balls,
    numBalls,
    mouseX,
    mouseY,
    0,
    random(bsize, bsize + 50),
    0,
    0,
    sl2.value()*-1,
    gravity,
    0
  );
  // Create moveFloor Object
  //balls[numBalls] = new Ball(balls, numBalls, mouseX, mouseY, random(20, 60), 5, 0, 0,friction);

  numBalls++;
}


// Ball class
class Ball3D {
  constructor(others, id, x, y, z, d, vx, vy, vz, accel, fr) {
    this.others = others;
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.d = d;
    this.r = this.d / 2;

    this.xspeed = vx;
    this.yspeed = vy;
    this.zspeed = vz;
    this.accel = accel; // gravity
    this.fr = fr; // initial floor friction

    this.rs = 0.95; // rebound speed reduction;
    this.mbs = 0.3; // minimum bounse speed;

    this.left = this.r;
    this.right = width - this.r;
    this.bottom = height - this.r;
    this.top = this.r;
    this.front = width+this.r;
    this.back = -width + this.r;

    this.fc = color(random(256), random(256), random(256));
  }


  freeFall() {
    this.yspeed += this.accel;

    if (this.fr > 0) {
      if (this.xspeed > 0.01) {
        this.xspeed -= this.fr;
      } else if (this.xspeed < -0.01) {
        this.xspeed += this.fr;
      } else {
        this.xspeed = 0;
      }
      if (this.zspeed > 0.01) {
        this.zspeed -= this.fr;
      } else if (this.zspeed < -0.01) {
        this.zspeed += this.fr;
      } else {
        this.zspeed = 0;
      }
    }

    this.x += this.xspeed;
    this.y += this.yspeed;
    this.z += this.zspeed;
    

    if (this.x > this.right) {
      this.x = this.right;
      this.xspeed *= -this.rs;
    } else if (this.x < this.left) {
      this.x = this.left;
      this.xspeed *= -this.rs;  
    }
     if (this.z > this.front) {
      this.z = this.front;
      this.zspeed *= -this.rs;
    } else if (this.z < this.back) {
      this.z = this.back;
      this.zspeed *= -this.rs;
    }
    
    if (this.y > this.bottom) {
      this.y = this.bottom;
      if (this.yspeed > this.mbs) {
        // minimum bounce speed
        this.yspeed *= -this.rs;
      } else {
        // if yspeed set to 0, set friction to 0.01;
        this.yspeed = 0;
        this.fr = friction;
      }
    } else if (this.y < this.top) {
      this.y = this.top;
      this.yspeed *= -this.rs;
      
    }
  }

  display() {
    if (cb1.checked() == true) {
      ambientLight(50, 50, 50);
      let dirX = (mouseX / width - 0.5) * 2;
      let dirY = (mouseY / height - 0.5) * 2;
      pV.set(-dirX, -dirY, 0);
      directionalLight(10, 10, 10, pV);

      specularMaterial(this.fc);
      fill(this.fc);
    } else {
      noFill();
    }

    if (cb4.checked() == true) {
      stroke(this.fc);
    } else {
      noStroke();
    }
    push();
    translate(this.x, this.y, this.z);
    sphere(this.r);
    pop();
    if (cb2.checked() == true) {
      push();
      translate(this.x, this.y, this.z);
      stroke(255, 0, 0);
      line(0, 0, 0, this.xspeed * mul, this.yspeed * mul, this.zspeed * mul);
      pop();
    }
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      let minDist = this.others[i].r + this.r;
      let distance = dist(this.x, this.y, this.z, this.others[i].x, this.others[i].y, this.others[i].z);

      if (distance < minDist) {
        let dx = this.others[i].x - this.x;
        let dy = this.others[i].y - this.y;
        let dz = this.others[i].z - this.z;
        
        let dv = createVector(dx, dy, dz);
        dv.normalize();
        dv.mult(minDist);
        let targetX = this.x + dv.x;
        let targetY = this.y + dv.y;
        let targetZ = this.z + dv.z;
        
        let vx = targetX - this.others[i].x;
        let vy = targetY - this.others[i].y;
        let vz = targetZ - this.others[i].z;
        
        
        let ax = vx * 0.05;
        let ay = vy * 0.05;
        let az = vz * 0.05;
        
        let pxs1 = this.xspeed;
        let pys1 = this.yspeed;
        let pzs1 = this.zspeed;
        
        let pxs2 = this.others[i].xspeed;
        let pys2 = this.others[i].yspeed;
        let pzs2 = this.others[i].zspeed;

        this.xspeed -= ax;
        this.yspeed -= ay;
        this.zspeed -= az;
        
        this.others[i].xspeed += ax;
        this.others[i].yspeed += ay;
        this.others[i].zspeed += az;

        // distance line
        if (cb5.checked() == true) {
          stroke(random(255), random(255), random(255));
          line(this.x, this.y, this.z, this.others[i].x, this.others[i].y, this.others[i].z);
        }

        if (cb3.checked() == true) {
          push();
          translate(this.x, this.y, this.z);
          stroke(0, 255, 0);
          strokeWeight(4);
          line(0, 0, 0, -ax * mul, -ay * mul, -az * mul);
          stroke(255, 0, 0);
          strokeWeight(3);
          line(0, 0, 0, pxs1 * mul, pys1 * mul, pzs1 * mul);
          stroke(255, 0, 255);
          strokeWeight(2);
          line(0, 0, 0, this.xspeed * mul, this.yspeed * mul, this.zspeed * mul);

          pop();
          push();
          translate(this.others[i].x, this.others[i].y, this.others[i].z);

          stroke(0, 0, 255);
          strokeWeight(3);
          line(0, 0,0, ax * mul, ay * mul, az * mul);

          stroke(255, 0, 0);
          line(0, 0,0, pxs2 * mul, pys2 * mul, pzs2 * mul);
          stroke(255, 0, 255);
          strokeWeight(2);
          line(0, 0, 0, this.others[i].xspeed * mul, this.others[i].yspeed * mul, this.others[i].zspeed * mul);
          pop();
        }
      }
    }
  }

  setStart(x, y, xs, ys) {
    this.x = x;
    this.y = y;
    this.xspeed = xs;
    this.yspeed = ys;
    this.fr = 0.0;
  }

  setSpeed(xs, ys) {
    this.xspeed = xs;
    this.yspeed = ys;
    this.fr = 0.0;
  }
}

let bLoop = true;
function keyPressed() {
  if (key == " ") {
    if (bLoop == true) {
      noLoop();
      bLoop = false;
    } else {
      loop();
      bLoop = true;
    }
  }
  if (key == "r") {
    redraw();
  }
}
