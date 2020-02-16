import Manager from "../scripts/Manager.js"
import {Application} from "../scripts/Application.js";

$(function () {
  'use strict'



  let application;
  let manager;



  function initialiseApplicationAndManager() {
    application = new Application({
        width: 1000,         // default: 800
        height: 600,        // default: 600
        antialias: true,    // default: false
        transparent: false, // default: false
        backgroundColor: 0xffffff,
        resolution: 1,      // default: 1
        preserveDrawingBuffer: true,
      }, true
    );
    manager = new Manager(application, true);
    application.manager = manager;
  }

  // Initialise the PIXI-application
  initialiseApplicationAndManager();
});
