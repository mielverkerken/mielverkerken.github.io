

//<editor-fold desc="AJAX-requests to server">
function initialiseClientReceiver(carManager) {

    //const client = new Paho.MQTT.Client('ws://broker.hivemq.com:8000/mqtt');
    const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, "clientID"+Math.floor(Math.random()*1000));

    client.connect({onSuccess:onConnect});
    client.onMessageArrived = onMessageArrived;
    client.onConnectionLost = onConnectionLost;


    function onConnect() {
        client.subscribe('/zonnebloempjes/updatemovingcars');
        client.subscribe('/zonnebloempjes/updatepath');
        console.log("Connection made");
    }

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }


    function onMessageArrived(messageData){
        //     const data = JSON.parse(message);
        const topic = messageData.destinationName;
        const message = messageData.payloadString;
        switch(topic) {
            case '/zonnebloempjes/updatemovingcars':
                //console.log("updatemovingcars: ", message);
                carManager.updateCarPositions(JSON.parse(message.toString()));
                break;
            case '/zonnebloempjes/updatepath':
                 // console.log("tilt: ", message.toString());
                //if(!carManager.application.path || carManager.application.path.points.length === 0)
                  carManager.followPath(JSON.parse(message.toString()));
                 break;
            // case '/zonnebloempjes/park':
            //     console.log("parked: ", message);
            //     break;

            default:
                console.log(`no handler for topic ${topic}}`);
        }
    };


    //module.exports = client;

}



//</editor-fold>
