import {LAYER} from "./Application.js";


const INIT_MAP_SCALE = 1;
const ABS_SCALE_FACTOR = Math.sqrt(Math.sqrt(2));
const MIN_SCALE = 0.8;
const MAX_SCALE = 3;


export class MapContainer extends PIXI.Graphics {
    application;
    mapSprite;

    dragging;

    layer;


    constructor(application) {
        super();

        // Inject application and mapInfo
        this.application = application;

        // Initialise sprite and add to this (container)
        this.mapSprite = new PIXI.Sprite(
            PIXI.loader.resources["map"].texture // IMPORTANT: Needs to be loaded
        );
        this.mapSprite.layer = LAYER.MAP;
        this.addChild(this.mapSprite);

        this.mapSprite.x = 0;
        this.mapSprite.y = 0;

        // Set layer to low value for background
        this.layer = LAYER.MAP;

        // Set pivot point to center of mapSprite
        this.pivot.x = this.mapSprite.width/2;
        this.pivot.y = this.mapSprite.height/2;
        // Set position to middle of view element of the stage
        this.x = this.application.renderer.view.width/2;
        this.y = this.application.renderer.view.height/2;
        // Set scale
        this.scale.set(INIT_MAP_SCALE);

        // Enable the map to be interactive... this will allow it to respond to mouse and touch events
        // Button mode will mean the hand cursor WON'T appear when you roll over the map with your mouse, this is reserved for other elements
        this.interactive = true;
        this.buttonMode = false;

        // Events for leftclick
        this.on('click', this.onLeftClick);
        // Events for drag start
        this.on('mousedown', this.onMouseDown);
        // Events for drag end
        this.on('mouseup', this.onMouseUp);
        this.on('mouseupoutside', this.onMouseUp);
        // Events for drag move
        this.on('mousemove', this.onMouseMove);

    }

    clearContainer() {
        this.removeChild(this.mapSprite);
    }

    setToDefaultSettings() {
        // Set position to middle of view element of the stage
        this.x = this.application.renderer.view.width/2;
        this.y = this.application.renderer.view.height/2;
        // Set scale
        this.scale.set(INIT_MAP_SCALE);

        this.application.manager.scaleHasBeenUpdated();

    }

    orderChildren(recursive = false) {
        // Update order of layers
        this.children.sort(function(a,b) {
            a.layer = a.layer || LAYER.UNSPECIFIED;
            b.layer = b.layer || LAYER.UNSPECIFIED;
            return a.layer - b.layer
        });
        if(recursive) {
            this.children.forEach((element) => {
                if(typeof element.orderChildren === "function") {
                    element.orderChildren(true)
                }
            });
        }
    }


    getScale() {
        return this.scale.x;
    }


    // LEFT CLICKING THE MAP
    onLeftClick() {

    }


    onMouseDown(event) {
        // DRAGGING THE MAP
        // Store a reference to the data
        this.data = event.data;
        this.dragging = true;

        this.previousMousePosition = this.data.getLocalPosition(this.parent);

    }

    onMouseUp(event) {
        // DRAGGING THE MAP
        this.dragging = false;
        this.data = null;
    }

    onMouseMove(event) {
        this.data = event.data;

        // DRAGGING THE MAP
        if (this.dragging)
        {

            let mousePosition = this.data.getLocalPosition(this.parent);
            let dx = mousePosition.x - this.previousMousePosition.x;
            let dy = mousePosition.y - this.previousMousePosition.y;

            this.position.x += dx;
            this.position.y += dy;

            this.previousMousePosition = mousePosition;
        }
    }

    // ZOOMING THE MAP
    zoomMap(deltaY) {
        // scale is equal in x and y direction
        let scale_factor = (deltaY > 0 ? 1/ABS_SCALE_FACTOR : ABS_SCALE_FACTOR);
        if((this.scale.x >= MIN_SCALE || scale_factor > 1) && (this.scale.x <= MAX_SCALE || scale_factor < 1)) {
            // Calculate new scale and keep it between MIN_SCALE and MAX_SCALE
            let newScale = this.scale.x * scale_factor;

            // Get mouse position relative to the stage origin
            let mousePosition = this.application.renderer.plugins.interaction.mouse.global;

            let dx = mousePosition.x - this.position.x;
            let dy = mousePosition.y - this.position.y;

            this.scale.set(newScale.toFixed(3));

            this.position.x = mousePosition.x - dx * scale_factor;
            this.position.y = mousePosition.y - dy * scale_factor;
        }

        return this.getScale();
    }




    getMouseRelativeToMap() {
        let mousePosition = this.application.renderer.plugins.interaction.mouse.global;
        return this.toLocal(mousePosition);
    }
}
