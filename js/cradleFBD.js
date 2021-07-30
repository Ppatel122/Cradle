let width = 350, length = 400;

let sim = function(p) {
    p.setup = function() {
        p.createCanvas(length, width);
        reset(p);

    };
  
    p.draw = function() {
        p.background(255);
        firstball.update();
        secondball.update();
        secondball.show(p);
        firstball.show(p);
        axes.show(p);
    };

}

let myp5 = new p5(sim, 'container1');

let Axis = function(p,l,w){
    this.p = p;
    this.l = l;
    this.w = w;
}

Axis.prototype.show = function(p){
    p.stroke(0);
    p.strokeWeight(0.5);
    p.line(this.l/2,0,this.l/2,this.w);
    p.line(0,this.w/2,this.l,this.w/2);
    p.fill(0);
    p.triangle(this.l/2,0,this.l/2+this.l/30,this.w/30,this.l/2-this.l/30,this.w/30);
    p.triangle(this.l,this.w/2,this.l-this.l/30,this.w/2-this.w/30,this.l-this.l/30,this.w/2+this.w/30);
    p.textStyle(ITALIC);
    p.textSize(20);
    p.text('x',this.l-10,this.w/2-10);
    p.text('y',this.l/2+10,10);
}


let Ball =  function(p,x,y,r,color,show,id){
    this.p = p;
    this.x = x;
    this.y = y;
    this.rad = r;
    this.v0 = createVector(x,y);
    this.v1 = createVector();
    this.v2 = createVector();
    this.v3 = createVector();
    this.v4 = createVector(0,0);
    this.vi = 0;
    this.vf = 0;
    this.color = color;
    this.mass = 5;
    this.textcolor = 'black';
    this.id = id;
    this.on = show;
}

Ball.prototype.show = function(p) {
    if(this.on){
        p.fill(255);
        p.strokeWeight(2);
        p.stroke(this.color);
        p.ellipse(this.x,this.y,this.rad);
        p.strokeWeight(2);
        p.stroke(0);
        p.fill(0);
        if(ballHit){
            if(this.id === 0 && this.vi > 0){
                drawArrow(p,this.v1,this.v3,color(0));
                p.textFont('STIX');
                p.textStyle(ITALIC);
                p.textSize(20);
                p.noStroke();
                p.fill(this.textcolor);
                vec = {x:20,y:193}
                p.text("v  = "+this.vi+ "m/s", vec.x,vec.y);
                p.textSize(11);
                p.text("i", vec.x+11,vec.y);
            }
            if(this.vf > 0){
                drawArrow(p,this.v0,this.v2,color(0));
                p.textFont('STIX');
                p.textStyle(ITALIC);
                p.textSize(20);
                p.noStroke();
                p.fill(this.textcolor);
                vec1 = {x:this.x + 5,y:165};
                p.text("v  = "+this.vf+ "m/s", vec1.x,vec1.y);
                p.textSize(11);
                p.text("f", vec1.x + 11,vec1.y);
            }
            
            this.v4.y = 20*gravity*this.mass;
            this.verifyArrows();
            if(gravity != 0){
                drawArrow(p,this.v0,this.v4,color(255,0,0));
                p.textFont('STIX');
                p.textStyle(ITALIC);
                p.textSize(20);
                p.noStroke();
                p.fill(255,0,0);
                vec1 = {x:this.v0.x + this.v4.x - 45,y: this.v0.y+this.v4.y + 15};
                p.text("F  = "+(this.mass*gravity*19.62).toFixed(2) + "N", vec1.x,vec1.y);
                p.textSize(11);
                p.text("g", vec1.x + 11,vec1.y);
            }

            this.v4.y *= -1;
            if(gravity != 0){
                drawArrow(p,this.v0,this.v4,color(0,0,255));
                p.textFont('STIX');
                p.textStyle(ITALIC);
                p.textSize(20);
                p.noStroke();
                p.fill(0,0,255);
                vec1 = {x:this.v0.x + this.v4.x - 45,y: this.v0.y+this.v4.y -5 };
                p.text("F  = "+(this.mass*gravity*19.62).toFixed(2) + "N", vec1.x,vec1.y);
                p.textSize(11);
                p.text("t", vec1.x + 11,vec1.y);
            }
            this.v4.y *= -1;
        }
    }
}

Ball.prototype.update = function(){
    this.mass = newtsCradle.cradle.bodies[this.id].mass;
}

Ball.prototype.verifyArrows = function(){
    if(this.v2.x < 20){
        this.v2.x = 20;
    } 

    if(this.v3.x < 20){
        this.v1.x = firstball.x-20;
        this.v3.x = 20;
    }

    if(this.v4.y < 20){
        this.v4.y = 20
    }
}

updateVectors = function(xVel,coef){
    let m1 =  firstball.mass, m2 = secondball.mass;
    firstball.vi = xVel.toFixed(2);
    firstball.vf = (((m1*xVel) - (m2*coef*xVel))/( m1 + m2)).toFixed(2);
    secondball.vi = 0;
    secondball.vf = (((m1*xVel) + (m1*coef*xVel))/( m1 + m2)).toFixed(2);
    
    firstball.v1.x = firstball.x - firstball.vi*8;
    firstball.v1.y = width/2;
    firstball.v3.x = firstball.vi*8;
    firstball.v3.y = 0;
    firstball.v0.x = firstball.x;
    firstball.v0.y = firstball.y;
    firstball.v2.x = firstball.vf*8;
    firstball.v2.y = 0;

    secondball.v1.x = secondball.x;
    secondball.v1.y = length/2;
    secondball.v3.x = 0;
    secondball.v3.y = 0;
    secondball.v0.x = secondball.x;
    secondball.v0.y = secondball.y;
    secondball.v2.x = secondball.vf*8;
    secondball.v2.y = 0;

    firstball.verifyArrows();
    secondball.verifyArrows();
}


reset = function(p){
    axes = new Axis(p,length,width);
    firstball = new Ball(p,length/2-width*0.20,width/2,width*0.4,color(0),true,0);
    secondball = new Ball(p,length/2+width*0.20,width/2,width*0.4,color(0),true,2);
}

drawArrow = function(p,base,vec,color){
    p.push();
    p.stroke(color);
    p.strokeWeight(3);
    p.fill(color);
    p.translate(base.x,base.y);
    p.line(0, 0, vec.x, vec.y);
    p.rotate(vec.heading());
    let arrowSize = 7;
    p.translate(vec.mag() - arrowSize, 0);
    p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    p.pop();
}