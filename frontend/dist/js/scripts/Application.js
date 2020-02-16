import Manager from "./Manager.js";
import {MapContainer} from "./MapContainer.js";
import {CarManager} from "./CarManager.js";
import {Car} from "./Car.js";
import {Path} from "./Path.js";


export const LAYER = {
    MAP: 1,
    PATH: 2,
    CAR: 5,
    UI_COMPONENTS: 20,
    UNSPECIFIED: 100
};


export class Application extends PIXI.Application {
    manager;
    mapContainer;
    carManager;
    path;
    navigateEnabled;


    constructor(initObject, navigate) {
        super(initObject);
        document.getElementById("display").addEventListener("wheel", function(event){
          event.preventDefault()
        });
        $("#display").append(this.view);
        $("#display > canvas").css("width","100%");
        this.ticker.add(delta => this.animate(delta));

        this.stage.interactive = true;
        this.stage.on('mousedown', this.onMouseDown);
        this.stage.on('mouseup', this.onMouseUp);
        this.stage.on('mousemove', this.onMouseMove);

        this.navigateEnabled = navigate;
    }

    animate(delta) {
        // render the stage
    }

    initialiseComponents() {
        // Initialise mapContainer
        this.mapContainer = new MapContainer(this);
        this.addChildToStage(this.mapContainer);
        this.carManager = new CarManager(this);
        initialiseClientReceiver(this.carManager);

    }

    clearComponents() {
        // Clear mapContainer
        this.removeChildFromStage(this.mapContainer);
        this.mapContainer.clearContainer();
        this.mapContainer = null;
        //TODO carManager
    }


//<editor-fold default="collapsed" desc="Mouse events">

    onMouseDown(event) {
        event.mouseHasMoved = 0;
    }

    onMouseUp(event) {
        let manager = Manager.instance;
        let application = Manager.instance.application;

        if(event.mouseHasMoved > 5) {
            event.firstTarget = null;
            return;
        }


    }

    onMouseMove(event) {
        event.mouseHasMoved++;
        let application = Manager.instance.application;
    }

//</editor-fold>

//<editor-fold default="collapsed" desc="Adding, removing and ordering children">

    addChildToStage(component) {
        this.stage.addChild(component);
        this.orderChildren(false);

    }

    removeChildFromStage(component) {
        this.stage.removeChild(component);
        this.orderChildren(false);
    }

    addChildToContainer(child) {
        if(child instanceof Car) {
            this.mapContainer.addChild(child);
            this.mapContainer.orderChildren();
        }
        else if(child instanceof Path) {
            this.mapContainer.addChild(child);
            this.mapContainer.orderChildren();
        }
    }

    removeChildFromContainer(child) {
        if(child instanceof Car) {
            this.mapContainer.removeChild(child);
        }
        else if(child instanceof Path) {
            this.mapContainer.removeChild(child);
        }
    }

    orderChildren(recursive = false) {
        // Update order of layers
        this.stage.children.sort(function(a,b) {
            a.layer = a.layer || LAYER.UNSPECIFIED;
            b.layer = b.layer || LAYER.UNSPECIFIED;
            return a.layer - b.layer
        });
        if(recursive) {
            this.stage.children.forEach((element) => {
                if(typeof element.orderChildren === "function") {
                    element.orderChildren(true)
                }
            });
        }
    }

//</editor-fold>


//<editor-fold default="collapsed" desc="Zoom map">
    zoomMap(deltaY) {
        this.mapContainer.zoomMap(deltaY);
    }

    isPositionOnMap(position) {
        let map = this.mapContainer.mapSprite;
        return position.x >= 0 && position.y >= 0 && position.x < map.width && position.y < map.height;
    }


//</editor-fold>



    focusOnCar(car) {
        if(!this.navigateEnabled) return;
        if(car) {
            this.mapContainer.interactive = false;
            this.manager.clearMouseWheelEvents();
            //TODO disable user control

            // Focus stage on car
            this.mapContainer.scale.set(2);
            let mapWidth = this.mapContainer.getScale()*this.mapContainer.mapSprite.width/2;
            let carFromBorderX = this.mapContainer.getScale()*car.x;
            let mapHeight = this.mapContainer.getScale()*this.mapContainer.mapSprite.height/2;
            let carFromBorderY = this.mapContainer.getScale()*car.y;
            this.mapContainer.x = this.renderer.view.width/2 + mapWidth - carFromBorderX;
            this.mapContainer.y = this.renderer.view.height/2 + mapHeight - carFromBorderY;

            if(this.path) this.path.drawPath();

        }
        else {
            this.mapContainer.interactive = true;
            this.manager.setMouseWheelEvents();
            this.mapContainer.scale.set(1);
            this.mapContainer.x = this.application.renderer.view.width/2;
            this.mapContainer.y = this.application.renderer.view.height/2;
        }
    }


    changePath(car, points) {
        if(!this.navigateEnabled) return;
        if(this.path) {
            this.removeChildFromContainer(this.path);
            this.path = null;
        }
        this.path = new Path(this, car, points);
        this.addChildToContainer(this.path);
    }

}

