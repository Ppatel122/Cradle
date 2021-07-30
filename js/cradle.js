/* TODO

Create FBD of First Collision

Show Calculations for first Collision

Fix Angle Glitch

Fix Mouse Control Glitch

PDF 

Video

Graphs

Scale Arrows

Force Arrows
Fix Text Position

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
    noStroke();
    fill(0);
    rect(208,55,285,20);
    Engine.update(engine);
    newtsCradle.update();
    newtsCradle.show();

    if(predictionView){
        projection.show();
        angles.show();
    }

    fill(255);
    rect(700,0,300,400);
    
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