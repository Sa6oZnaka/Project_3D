function collision(o1, o2){

    if(o1.x > o2.x - o2.sizeX - 350 && o1.x < o2.x + o2.sizeX + 350 &&
        o1.z > o2.z - o2.sizeZ - 330 && o1.z < o2.z + o2.sizeZ + 330){
        ObjArr[0].speed = -ObjArr[0].speed;

        return 1;
    }
    return 0;
}

function preload(){
    // textures
    img = loadImage('assets/Porsche_911_GT2/skin00/0000-a2.png');

    // models
    house = loadModel('assets/house.obj');
    car = loadModel('assets/Porsche_911_GT2/Porsche_911_GT2.obj');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

let ObjArr = [];

function Input(){
    if (keyIsDown(LEFT_ARROW)) {
        ObjArr[0].Move("LEFT");
    }
    if (keyIsDown(RIGHT_ARROW)) {
        ObjArr[0].Move("RIGHT");
    }
    if (keyIsDown(UP_ARROW)) {
        ObjArr[0].Move("UP");
    }
    if (keyIsDown(DOWN_ARROW)) {
        ObjArr[0].Move("DOWN");
    }
};

function CreateSmallHouse(x, y, z, angle){
    let temp = new Building(x, y, z, 660, 700, 840, angle, "Static", "SmallHouse");
    ObjArr.push(temp);
}

// Create dynamic object
let temp = new Movable(-505, 120, 10, 140, 100, 350, 30, "dynamic", "Porsche_911_GT2", 2);
ObjArr.push(temp);

// static objects
CreateSmallHouse(1400, 150, -100, 0);
CreateSmallHouse(2200, 150, -100, 0);
CreateSmallHouse(100, 150, 700, 0);

function draw() {

    directionalLight(255,255, 255,  0, 1, 0);
    directionalLight(255,255, 255,  1, 0, 0);

    // Collision //
    for(let i = 0; i < ObjArr.length; i ++){
        if(ObjArr[i].type === "dynamic"){
            for(let j = 0; j < ObjArr.length; j ++){
                if(i !== j){
                    collision(ObjArr[j], ObjArr[i]);
                }
            }
        }
    }

    for(let i = 0; i < ObjArr.length;i ++){
        if(ObjArr[i].type === "dynamic"){
            ObjArr[i].Update();
        }
    }

    camera(ObjArr[0].x, ObjArr[0].y - 100, 400 + ObjArr[0].z, ObjArr[0].x + ObjArr[0].angle, ObjArr[0].y, ObjArr[0].z, 0, 1, 0);

    background(100);

    push();
    //fill(0, 100, 0);
    ambientMaterial(0, 255, 0);
    translate(-275, 175);
    box(100000, 1, 100000);
    pop();

    //noFill();
    stroke(255);

    for(let i = 0;i < ObjArr.length;i ++){

        if(ObjArr[i].type === "dynamic"){
            if(ObjArr[i].id === "Porsche_911_GT2"){
                push();
                translate(ObjArr[i].x, ObjArr[i].y, ObjArr[i].z);
                rotateZ(PI);
                rotateY(ObjArr[i].angle);
                scale(80);
                noStroke();
                specularMaterial(255, 255, 0);
                model(car);
                pop();

                // HIT BOX
                push();
                noFill();
                //normalMaterial();
                translate(ObjArr[i].x, ObjArr[i].y, ObjArr[i].z);
                rotateY(-ObjArr[i].angle);
                box(ObjArr[i].sizeX, ObjArr[i].sizeY, ObjArr[i].sizeZ);
                pop();
            }
        }else{
            if(ObjArr[i].id === "SmallHouse"){
                push();
                noStroke();
                translate(ObjArr[i].x - 40, ObjArr[i].y, ObjArr[i].z + 25);
                rotateZ(PI);
                scale(2);
                ambientMaterial(255, 0, 0);
                model(house);
                pop();

                // HITBOX
                push();
                noFill();
                translate(ObjArr[i].x, ObjArr[i].y, ObjArr[i].z);
                box(ObjArr[i].sizeX, ObjArr[i].sizeY, ObjArr[i].sizeZ);
                pop();
            }
        }
    }

    Input();
}