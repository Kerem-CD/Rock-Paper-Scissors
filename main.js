/** @type {import("./phaser.js");} */
var x = 400
var y = 300
var Texts=[];
var Directions=[];
var ListMap = [];
var Speed = 3;


anglecalc=(angle,speed)=>[Math.cos(angle)*speed,Math.sin(angle)*speed]
indexemoji=(index)=>["rock","paper","scissors"][index%3]
rng=(mn,mx)=>Math.floor(Math.random() * (mn + 1 - mx) + mx)
const allEqual=(arr)=> arr.every(val => val === arr[0]);

var gameheight = 600
var gamewidth = 800
class Game extends Phaser.Scene
{
    preload (){
        this.load.image('rock', './rock.png');
        this.load.image('scissors', './scissors.png');
        this.load.image('paper', './paper.png');
        this.load.image('background', './background.jpeg');
        

    }

    create ()
    {
        //background
        background("background",this)
        for (let i=0;i<100;i++){
            Texts[i] = this.add.sprite(rng(0,gamewidth),rng(0,gameheight),indexemoji(i))
            console.log(Texts[i].texture.key)
            Texts[i].setScale(0.05)
            //on edge of screen alert("edge")
            
            Directions[i]=rng(0, 360)
        }
            //on click

        //always move rock
        

    }
    update (){
        for (let i=0;i<100;i++){
            Texts[i].x+=anglecalc(Directions[i], Speed)[0]
            Texts[i].y+=anglecalc(Directions[i], Speed)[1]
            if (Texts[i].x>gamewidth || Texts[i].x<0 || Texts[i].y>gameheight || Texts[i].y<0){
                Directions[i]=(Directions[i]-180)
            }
            for (let j=0;j<100;j++){
                // if touching another sprite
                if (i!=j && Phaser.Geom.Intersects.RectangleToRectangle(Texts[i].getBounds(),Texts[j].getBounds())){
                    if (Texts[i].texture.key=="paper" && Texts[j].texture.key=="rock"){
                        Texts[j].setTexture("paper")
                        console.log("paper wins")
                    }
                    else if (Texts[i].texture.key=="scissors" && Texts[j].texture.key=="paper"){
                        Texts[j].setTexture("scissors")

                        console.log("scissors wins")
                    }
                    else if (Texts[i].texture.key=="rock" && Texts[j].texture.key=="scissors"){
                        Texts[j].setTexture("rock")

                        console.log("rock wins")
                    }
                        
                    
                }
            }
        }
        //if game finished
        for (let i=0;i<100;i++){
            ListMap[i]=Texts[i].texture.key
        }
        if (allEqual(ListMap)){
            this.add.rectangle(0,0,gamewidth,gameheight,0x501010).setOrigin(0)
            var fontsize = gamewidth/12
            centeredtext(fontsize/2,"Game Over, "+ListMap[0]+" wins",fontsize,this)
            centeredtext(-fontsize/2,"Click to restart",fontsize,this)
            this.input.on('pointerdown', () => this.scene.restart())

            console.log("game over")

        }
    }

    
}



document.addEventListener("DOMContentLoaded", () => {
    gameheight = window.innerHeight
    gamewidth = window.innerWidth
    const config = {
        type: Phaser.AUTO,
        width: gamewidth,
        height: gameheight,
        scene: Game,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
             }
        }   
    };
    const game = new Phaser.Game(config);
})


function background(name, scene){
    let image = scene.add.image(scene.cameras.main.width / 2, scene.cameras.main.height / 2, name)
    let scaleX = scene.cameras.main.width / image.width
    let scaleY = scene.cameras.main.height / image.height
    let scale = Math.max(scaleX, scaleY)
    image.setScale(scale).setScrollFactor(0)
}

function centeredtext(ydifference,text,fontSize,scene){
    const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
    return scene.add.text(screenCenterX, screenCenterY + ydifference,text,{fontSize: fontSize}).setOrigin(0.5);
}
