import {Car} from "./Car.js";

const urlParams = new URLSearchParams(window.location.search);
const queryCarId = urlParams.get('id');
console.log(queryCarId);

export class CarManager {
    application;
    cars;
    drivingCar;


    constructor(application) {
        this.application = application;
        this.cars = [];
        this.drivingCar = null;

        /*Dummy*/
        // let car = new Car(this.application, "xxx", 100, 100, 0);
        // this.application.addChildToContainer(car);
        // this.cars.push(car);
        // this.drivingCar = car;
        // this.followPath([{x:100,y:150}, {x:150,y:100}, {x:150,y:200}]);
        // this.updateCarPositions({});

    }


    updateCarPositions(carsData){
        //console.log('carsData: ', carsData);
        for (let carId in carsData) { if (Object.prototype.hasOwnProperty.call(carsData, carId)) {
            let car = this.cars.find(c => c.id === carId);
            if(!car) {
                car = new Car(this.application, carId, carsData[carId].x, carsData[carId].y, 0);
                this.application.addChildToContainer(car);
                this.cars.push(car);
                if(this.application.navigateEnabled && carId === queryCarId) {
                  this.drivingCar = car;
                }
            }
            car.updateCarPosition(carsData[carId].x, carsData[carId].y, -carsData[carId].angle);
            // Speed representation
            /*
            let canvas = document.getElementById("speedrepr");
            let context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.strokeStyle = 'red';
            context.moveTo(50, 50);
            context.lineTo(50 + carsData[carId].speed*10*Math.cos(carsData[carId].angle), 50 + carsData[carId].speed*10*Math.sin(carsData[carId].angle));
            context.lineWidth = 5;
            context.stroke();
            */
            }
        }
        if(this.drivingCar && this.application.navigateEnabled) {
            this.application.focusOnCar(this.drivingCar);
        }
    }

    followPath(pathData) {
        this.application.changePath(this.drivingCar, pathData);
    }


}









