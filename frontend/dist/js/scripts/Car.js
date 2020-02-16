import {LAYER} from "./Application.js";

export class Car extends PIXI.Graphics {
    application;
    carSprite;
    prevX;
    prevY;

    constructor(application, id, x, y, rotation) {
        super();
        this.id = id;
        this.x = x;
        this.y = y;
        this.rotation = rotation;

        this.prevX = null;
        this.prevY = null;

        this.carSprite = new PIXI.Sprite(
            PIXI.loader.resources["car"].texture // IMPORTANT: Needs to be loaded
        );
        this.carSprite.layer = LAYER.CAR;
        this.carSprite.x = 0;
        this.carSprite.y = 0;
        this.carSprite.scale.set(0.03);
        this.addChild(this.carSprite);

        // Set pivot point to center of mapSprite
        this.pivot.x = 3*this.carSprite.width/5;
        this.pivot.y = this.carSprite.height/2;
    }

    updateCarPosition(x,y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;


        this.prevX = x;
        this.prevY = y;
    }


}
