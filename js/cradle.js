/* TODO


Show Calculations for first Collision

Fix Angle Glitch

Fix Mouse Control Glitch

PDF 

Video

Graphs


*/


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint;

let engine, 
    render, 
    mouse, 
    coeff = 1,
    gravity = 0.5,
    massSelection = 6,
    graphSelection = 2,
    canvas1,
    initAngle = Math.PI/4,
    predictionView = false,
    motion = false,
    ballHit = false;

function setup(){

    var canvas = createCanvas(1000,400);
    canvas.parent("container");
    resetSim();

}

function draw(){
    background(100);
    plotx.display();
    ploty.display();
    stroke(100);
    strokeWeight(5);
    line(700,199.5,1000,199.5);
    Engine.update(engine);
    newtsCradle.update();
    newtsCradle.show();




    if(predictionView){
        projection.show();
        angles.show();
    }

    vectorcol.updateVector(newtsCradle.cradle.bodies[0].position,1);
    

    
}


function resetSim(){
    engine = Engine.create(),
    world = engine.world,
    engine.world.gravity.y = 0.5;
    predictionView = false,
    motion = false,
    ballHit = false,
    initAngle = Math.PI/4,
    coeff = 1,
    gravity = 0.5,
    massSelection = 6,
    graphSelection = 2;

    engine.world.gravity.y = 0.5;
    
    mouse = Mouse.create(canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        Composite.add(world, mouseConstraint);
    
    newtsCradle = new Cradle(236, 75, 5, 30, 200);

    for(let i = 0; i < newtsCradle.number;i++){
        Body.setMass(newtsCradle.cradle.bodies[i],5);
    }

    projection = new Projection(236,275,464,275,60);

    angles = new Angles(230,73,460,73);

    vectorcol = new VectorCollection(3, [color(255,0,0),color(0,255,0),color(0,0,255)], "Velocity", "Position", "Acceleration");

    plotx = new Plot(700,0,300,200);
    plotx.addLine(new Lines("Velocity", [255, 0, 0], 0));
    plotx.addLine(new Lines("Position", [0, 255, 0], 1));
    plotx.addLine(new Lines("Acceleration", [0, 0, 255], 2));
   
    ploty = new Plot(700,200,300,200);
    ploty.addLine(new Lines("Velocity", [255, 0, 0], 0));
    ploty.addLine(new Lines("Position", [0, 255, 0], 1));
    ploty.addLine(new Lines("Acceleration", [0, 0, 255], 2));

    Engine.run(engine);
}

function checkForMotion(){
    motion = false;
    for(let i = 0; i < newtsCradle.number;i++){
        if(abs(newtsCradle.cradle.bodies[i].velocity.x) > 0.1 || abs(newtsCradle.cradle.bodies[i].velocity.y)  > 0.1){
            motion = true;
            return;
        }
    }
}

function predictOutput(){
    predictionView = true;
    let prevVel = 0,vel = 0;
    xInitial = [];
    yInitial = [];
    newtsCradle.resetBalls();
    for(let i = 0; i < newtsCradle.number; i++){
        Engine.update(engine);
        xInitial[i] = newtsCradle.positionsX[i];
        yInitial[i] = newtsCradle.positionsY[i];
    }

    newtsCradle.applyAngle();
    Engine.update(engine);
    let x1 = newtsCradle.cradle.bodies[0].position.x,y1 = newtsCradle.cradle.bodies[0].position.y;
    
    for(let i = 0; i < 1000;i++){
        prevVel = newtsCradle.cradle.bodies[0].velocity.x;
        Engine.update(engine);
        if(newtsCradle.cradle.bodies[1].position.x -newtsCradle.cradle.bodies[0].position.x < 60 && !ballHit){
            ballHit = true;
            
            if(newtsCradle.cradle.bodies[0].velocity.x < 0){
                vel = prevVel;
            } else{
                vel = newtsCradle.cradle.bodies[0].velocity.x;
            }
            updateVectors(vel,parseFloat(coeff));
        }
        if(newtsCradle.cradle.bodies[4].velocity.x < -0.1 /*FIX HERE*/ ){
            projection.update(x1,y1,newtsCradle.cradle.bodies[4].position.x,newtsCradle.cradle.bodies[4].position.y);
            angles.update(findAngle(236-x1,75-y1),findAngle(464-newtsCradle.cradle.bodies[4].position.x,75-newtsCradle.cradle.bodies[4].position.y));
            break; 
        }
    }

    for(let i = 0; i < newtsCradle.number; i++){
        Body.setPosition(newtsCradle.cradle.bodies[i],{x:xInitial[i],y:yInitial[i]})
        Body.setVelocity(newtsCradle.cradle.bodies[i],{x:0,y:0});

        newtsCradle.resetBalls();
    }
}

function findAngle(x,y){
    return ((180/Math.PI)*Math.atan(abs(x)/abs(y)));
}

function mousePressed(){
    // if(dist(mouseX,mouseY,newtsCradle.cradle.bodies[0].position.x,newtsCradle.cradle.bodies[0].position.y) < 30){
    //     predictionView = false;
    //     Engine.update(engine);
    //     predictOutput();
    // }
}

class Cradle {
    constructor(xx, yy, number, size, length){
        this.cradle = Composite.create({ label: 'Newtons Cradle' });
        this.xx = xx;
        this.yy = yy;
        this.length = length;
        this.size = size;
        this.separation = 1.9;
        this.number = number;
        this.positionsX = [];
        this.positionsY = [];
        this.masses = [5,5,5,5,5];

        for (var i = 0; i < number; i++) {
            var separation = 1.9,
                circle = Bodies.circle(xx + i * (size * separation), yy + length, size, { 
                      render:{fillStyle: 'black'},
                      inertia: Infinity, 
                      restitution: 1, 
                      mass:5,
                      friction: 0, 
                      frictionAir: 0.0001, 
                      slop: 1 
                    }),
                constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });
    
            Composite.addBody(this.cradle, circle);
            Composite.addConstraint(this.cradle, constraint);
        }
        Composite.add(world, this.cradle);
    }

    update(){
        for(var i = 0; i < this.number; i++){
            this.positionsX[i] = this.cradle.bodies[i].position.x
            this.positionsY[i] = this.cradle.bodies[i].position.y
        }
    }

    show(){
        noStroke();
        fill(100);
        rect(0,0,700,400);
        fill(0);
        rect(208,55,285,20);
        for(var i = 0; i < this.number; i++){
            fill(0);
            noStroke();
            ellipse(this.positionsX[i],this.positionsY[i],this.size*2);

            stroke(255);
            strokeWeight(2);          
            line(this.xx +i * (this.size * this.separation),this.yy,this.positionsX[i],this.positionsY[i]);
        }
        
    }

    applyAngle(){
        var xVal = ((236-(200*Math.sin(initAngle))) - this.cradle.bodies[0].position.x), yVal = ( (75+(200*Math.cos(initAngle))) - this.cradle.bodies[0].position.y);
        Body.translate(this.cradle.bodies[0],{x: xVal ,y: yVal})
    }

    resetBalls(){
        for(let i = 0; i < this.number;i++){
            Body.setPosition(newtsCradle.cradle.bodies[i],{x:this.xx + i * (this.size * this.separation),y:this.yy + this.length})
            Body.setVelocity(newtsCradle.cradle.bodies[i],{x:0,y:0});
        }
    }


}


class Projection{
    constructor(x1,y1,x2,y2,rad){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.rad = rad;
    }

    show(){
        noFill();
        stroke(0,255,0);
        strokeWeight(2);
        line(236,75,this.x1,this.y1);
        ellipse(this.x1,this.y1,this.rad);

        stroke(255,0,0);
        line(464,75,this.x2,this.y2);
        ellipse(this.x2,this.y2,this.rad);
    }

    update(x1,y1,x2,y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

class Angles {
    constructor(x1,y1,x2,y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.angle1;
        this.angle2;    
    }

    update(a1,a2){
        this.angle1 = a1.toFixed(1);
        this.angle2 = a2.toFixed(1);
    }

    show(){
        textFont('STIX');
        textStyle(ITALIC);
        strokeWeight(1);
        
        fill(0,255,0);
        stroke(0,255,0);
        textSize(18);
        text("θ  = " + this.angle1,210,60);
        textSize(12);
        text("i",222,60);
        noFill();
        arc(236,75,30,30,HALF_PI,HALF_PI+this.angle1*(PI/180));

        fill(255,0,0);
        stroke(255,0,0);
        textSize(18);
        text("θ  = " + this.angle2,440,60);
        textSize(12);
        text("f",452,60);noFill();
        arc(464,75,30,30,HALF_PI-this.angle2*(PI/180),HALF_PI);


    }
}

class Plot{
    constructor( x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.max = 100;
        this.lines = [];
        this.pause = false;
    }

    update(){
        let currentMax = 0;
        for (let i = 0; i < this.lines.length; i++) {
          let coordinates = this.lines[i];
          coordinates.update();
          for (let j = 0; j < coordinates.points.length; j++) {
            currentMax = max([currentMax, abs(coordinates.points[j].y), 100]);
          }
        }
        this.max = currentMax;
    }

    display(){
        let point;
        //Setup

        fill(0);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        stroke(255);
        strokeWeight(2);
        line(this.x, this.y + this.h/2, this.x + this.w, this.y + this.h/2);
        fill(255);
        line(this.x + this.w, this.y + this.h/2 - 71, this.x + this.w - 20, this.y +this.h/2 - 71);
        line(this.x + this.w, this.y + this.h/2 + 71, this.x + this.w - 20, this.y +this.h/2 + 71);
        noStroke();
        text(this.max.toFixed(2).replace('-0', '0'), this.x + this.w - 50, this.y +this.h/2 - 75);
        text(this.max.toFixed(2).replace('-0', '0'), this.x + this.w - 50, this.y +this.h/2 + 85);
        if (!this.pause) {
            this.update();
        } else {
            push();
            fill([255, 0, 0]);
            stroke([255, 0, 0]);
            textSize(20);
            text("PAUSED", 0, height);
            pop();
        }
        //Draw Plot
        for (let i = 0; i < this.lines.length; i++) {
            let coordinates = this.lines[i];
            beginShape();
            noFill();
            stroke(coordinates.color);
            for (let j = 0; j < coordinates.points.length; j++) {
            let point = coordinates.points[j];
            vertex(point.x, -map(point.y, -this.max , this.max, -70, 70) + this.y + this.h/2);
            
            }
            endShape();
        }
        //Hover Text
        push();
        stroke([123,21,123,125]);
        fill([123,21,123,125])
        textSize(20);
        //Find closest X TODO: Find closest Y
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            let point = (this.lines[0].points.reduce((previousPoint, currentPoint) => {
            return (abs(currentPoint.x - mouseX) < abs(previousPoint.x - mouseX) ? currentPoint : previousPoint)
            }));
            let index = this.lines[0].points.indexOf(point);
            let coordinates = (this.lines.reduce((previousLine, currentLine) => {
                let previousPoint = map(previousLine.points[index].y, -this.max , this.max, -70, 70);
                let currentPoint = map(currentLine.points[index].y, -this.max , this.max, -70, 70);
            return (abs(currentPoint + mouseY - height/2) < abs(previousPoint + mouseY - height/2) ? currentLine : previousLine)
            }));
            line(this.x, -map(coordinates.points[index].y, -this.max , this.max, -70, 70) + this.y +this.h/2, this.x + this.w, -map(coordinates.points[index].y, -this.max , this.max, -70, 70) + this.h/2);
            line(mouseX, 0, mouseX, height);
            fill(coordinates.color);
            stroke(coordinates.color);
            text(`x: ${mouseX.toFixed(0).replace('-0', '0')} ${coordinates.name}: ${coordinates.points[index].y.toFixed(3).replace('-0', '0')}`, this.x + 10, this.y + this.h - 5);
        }
        pop();
    }

    addLine(coordinates) {
        this.lines.push(coordinates);
    }

    pressed(){
        if (this.pause === false) {
            this.pause = true;
          } else {
              this.pause = false;
              this.reset();
          }
    }

    reset(){
        for (let coordinates of this.lines) {
            coordinates.points = [];
        }
    }
}


class Lines {
    constructor(name, color, id, width=1000){
        this.points = [];
        this.name = name;
        this.color = color;
        this.width = width;
        this.speed = 4;
        this.vector = createVector(0,0);
        vectorcol.addListener(this.updateVector.bind(this), id);
    }

    updateVector(vector){
        this.vector = vector;
    }

    update(){
        this.points.push(createVector( this.width + this.speed, this.vector.y));
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            point.x -= this.speed;
            if (point.x < 0) {
            this.points.shift();
            }
        }
    }
}

class VectorCollection {
    constructor(n,colors,names){
        this.names = names;
        this.colors = colors;
        this.vectors = [];
        this.offsets = [];
        this.listeners = {};
        this.max = 0;
        this.base = createVector(width - 100, height/2);
        for (let i = 0; i < n ; i++) {
            this.vectors[i] = createVector(0, 0);
        }
    }

    updateVector(vector, n) {
        if (n > this.vectors.length - 1) {
          throw "No selectable vector";
        } else {
          this.vectors[n].add(vector);
          this.vectors[this.vectors.length - 1].add(vector);
        }
      }

      addListener(listener, id) {
        this.listeners[id] = listener;
      }
    
      maxValue() {
        let currentMax = 50;
        for (let i = 0; i < this.vectors.length; i++) {
          currentMax = this.p.max([currentMax, this.p.abs(this.vectors[i].y), 50]);
        }
        this.max = currentMax;
      }
}