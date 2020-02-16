import {LAYER} from "./Application.js";

export class Path extends PIXI.Graphics {
    application;
    points;
    car;
    layer;

    constructor(application, car, points) {
        super();
        this.application = application;
        this.car = car;
        this.points = points;
        this.layer = LAYER.PATH;
    }

    drawPath() {
        this.clear();

        this.lineStyle(8, 0x0000ff, 0.3);
        this.moveTo(this.car.x, this.car.y);
        for(let i = 0; i < this.points.length; i++) {
            if(i === 0) {
                let dist = distSq(this.car, this.points[i]);
                if(dist > 10) {
                    this.moveTo(
                        this.car.x + 15*(this.points[i].x - this.car.x)/Math.sqrt(dist),
                        this.car.y + 15*(this.points[i].y - this.car.y)/Math.sqrt(dist)
                    );
                }
            }
            this.lineTo(this.points[i].x, this.points[i].y);
            if(i === this.points.length - 1) {
                this.beginFill(0x0000ff, 0);
                this.drawCircle(this.points[i].x, this.points[i].y, 12);
                this.endFill();
                this.beginFill(0x0000ff, 0.5);
                this.drawCircle(this.points[i].x, this.points[i].y, 8);
                this.endFill();
            }
        }

        function distSq(a,b) {
            return (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y);
        }

    }

}