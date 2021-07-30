var elCoef,elAng,elGrav,elMassSelect,elGraphSelect,elMass,elReset,elApply,el1,el2,el3,el4;

window.onload = () => {
    // //Prevent right-click on simulation from bringing up the context menu
    // document.oncontextmenu = function() {
    //   if (mouseX > 0 && mouseY > 0 && mouseX < 1000 && mouseY < 500){
    //     return false;
    //   }
    // }
    elCoef = document.querySelectorAll("#coef");
    elAng = document.querySelectorAll("#ang");
    elGrav = document.querySelectorAll("#grav");
    elMass = document.querySelectorAll("#mass");
    elReset = document.querySelector("#reset-button");
    elApply = document.querySelector("#apply-button");
    elMassSelect = document.querySelectorAll(".mass-select-toggle");
    elGraphSelect = document.querySelectorAll(".graph-select-toggle");
    el1 = document.querySelector("#e1");
    el2 = document.querySelector("#e2");
    el3 = document.querySelector("#e3");
    el4 = document.querySelector("#e4");


    elGrav[0].oninput = () => {
        let grav = parseFloat(elGrav[0].value).toFixed(2);
        el3.innerHTML = grav;
        elGrav[1].value = grav;

        engine.world.gravity.y = grav/9.81;
        

        if(predictionView){
            gravity = grav/19.62;
            predictionView = false;
            ballHit = false;
            newtsCradle.resetBalls();
            Engine.update(engine);
            predictOutput();
        }
    };

    elGrav[1].oninput = () => {
        let grav = parseFloat(elGrav[1].value).toFixed(2);
        el3.innerHTML = grav;
        elGrav[0].value = grav;

        engine.world.gravity.y = grav/19.62;

        

        if(predictionView){
            gravity = grav/19.62;
            predictionView = false;
            ballHit = false;
            newtsCradle.resetBalls();
            Engine.update(engine);
            predictOutput();
        }
    };

    elMass[0].oninput = () => {
        let mass = parseFloat(elMass[0].value).toFixed(2);
        el4.innerHTML = mass;
        elMass[1].value = mass;

        if(massSelection === 6 ){
            for(let i = 0; i < newtsCradle.number;i++){
                Body.setMass(newtsCradle.cradle.bodies[i],mass);
            }
        } else {
            Body.setMass(newtsCradle.cradle.bodies[massSelection-1],mass);
        }

        if(predictionView){
            predictionView = false;
            ballHit = false;
            newtsCradle.resetBalls();
            Engine.update(engine);
            predictOutput();
        }
    };

    elMass[1].oninput = () => {
        let mass = parseFloat(elMass[1].value).toFixed(2);
        el4.innerHTML = mass;
        elMass[0].value = mass;

        if(massSelection === 6 ){
            for(let i = 0; i < newtsCradle.number;i++){
                Body.setMass(newtsCradle.cradle.bodies[i],mass);
            }
        } else {
            Body.setMass(newtsCradle.cradle.bodies[massSelection-1],mass);
        }

        if(predictionView){
            predictionView = false;
            ballHit = false;
            newtsCradle.resetBalls();
            Engine.update(engine);
            predictOutput();
        }
    };
    
    elCoef[0].oninput = () => {
        let coef = parseFloat(elCoef[0].value).toFixed(2);
        for(let i = 0; i < 5;i++) {
            newtsCradle.cradle.bodies[i].restitution = coef;
        }
        el1.innerHTML = coef;
        elCoef[1].value = coef;
        coeff = coef;

        if(predictionView){
            predictionView = false;
            ballHit = false;
            newtsCradle.resetBalls();
            Engine.update(engine);
            predictOutput();
        }
    };

    elCoef[1].oninput = () => {
        let coef = parseFloat(elCoef[1].value).toFixed(2);
        for(let i = 0; i < 5;i++) {
            newtsCradle.cradle.bodies[i].restitution = coef;
        }
        el1.innerHTML = coef;
        elCoef[0].value = coef;
        coeff = coef;

        if(predictionView){
            predictionView = false;
            ballHit = false;
            newtsCradle.resetBalls();
            Engine.update(engine);
            predictOutput();
        }
    };

    elAng[0].oninput = () => {
        let ang = (parseFloat(elAng[0].value).toFixed(1));
        initAngle = (Math.PI/180)*ang;
        el2.innerHTML = ang;
        elAng[1].value = ang;

        predictionView = false;
        ballHit = false;
        newtsCradle.resetBalls();
        Engine.update(engine);
        predictOutput();
    };

    elAng[1].oninput = () => {
        let ang = (parseFloat(elAng[1].value).toFixed(1));
        initAngle = (Math.PI/180)*ang;
        el2.innerHTML = ang;
        elAng[0].value = ang;

        predictionView = false;
        ballHit = false;
        newtsCradle.resetBalls();
        Engine.update(engine);
        predictOutput();
    };

    elApply.onclick = () => {
        predictionView = false;

        newtsCradle.resetBalls();
        Engine.update(engine);
        newtsCradle.applyAngle();


    };

    elReset.onclick = () => {
        resetSim();
        el1.innerHTML = 1;
        elCoef[0].value = 1;
        elCoef[1].value = 1;

        el2.innerHTML = 45;
        elAng[0].value = 45;
        elAng[1].value = 45;

        el4.innerHTML = 5;
        elMass[0].value = 5;
        elMass[1].value = 5;

        el3.innerHTML = 9.81;
        elGrav[0].value = 9.81;
        elGrav[1].value = 9.81;
    };

    for (const elMassSelectBtn of elMassSelect) {
        elMassSelectBtn.onclick = function() {
            massSelection = parseFloat(elMassSelectBtn.firstElementChild.value);
            if(massSelection === 6){
                mass = newtsCradle.cradle.bodies[0].mass
                for(let i = 0; i < newtsCradle.number;i++){
                    Body.setMass(newtsCradle.cradle.bodies[i],mass);
                }
                el4.innerHTML = mass;
                elMass[0].value = mass;
                elMass[1].value = mass;
            } else {
                el4.innerHTML = newtsCradle.cradle.bodies[massSelection-1].mass;
                elMass[0].value = newtsCradle.cradle.bodies[massSelection-1].mass;
                elMass[1].value = newtsCradle.cradle.bodies[massSelection-1].mass;
            }
            for (let elMassSelectBtn2 of document.querySelectorAll(".mass-select-toggle")) {
                if (this === elMassSelectBtn2) {
                    elMassSelectBtn2.classList.add("mass-select-toggle-active");
                } else {
                    elMassSelectBtn2.classList.remove("mass-select-toggle-active");
                }
            }
        }
    }

    for (const elGraphSelectBtn of elGraphSelect) {
        elGraphSelectBtn.onclick = function() {
            console.log(graphSelection);
            graphSelection = parseFloat(elGraphSelectBtn.firstElementChild.value);
            for (let elGraphSelectBtn2 of document.querySelectorAll(".graph-select-toggle")) {
                if (this === elGraphSelectBtn2) {
                    elGraphSelectBtn2.classList.add("graph-select-toggle-active");
                } else {
                    elGraphSelectBtn2.classList.remove("graph-select-toggle-active");
                }
            }
        }
    }
}

function showMenu(id) {
  document.getElementById(id).classList.toggle("show");
}


