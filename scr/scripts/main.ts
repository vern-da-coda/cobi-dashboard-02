import Dashboard from "./dashboard";

declare let COBI: any;

init();

window.onresize = init;

/**
 *
 */
function init() {

    let dashboard = new Dashboard('experience', window.innerWidth, window.innerHeight);

    COBI.init('token — can by anything right now');

    if (COBI.parameters.state() === 'experience') {

        dashboard.initExperienceView();

        COBI.app.theme.subscribe(
            function (value) {
                console.log(value)
            }
        );

        COBI.rideService.speed.subscribe(
            function (value) {
                dashboard.updateCurrentSpeedView(value * 3.6);
            }
        );

        COBI.tourService.averageSpeed.subscribe(
            function (value) {
                dashboard.updateAverageSpeedView(value * 3.6);
            }
        );

        COBI.rideService.cadenceAvailability.subscribe(
            function (value) {
                console.log('cadence available: ' + value);
            }
        );

        COBI.rideService.cadence.subscribe(
            function (value) {
                dashboard.updateCurrentCadenceView(value);
            }
        );
    } else {
        dashboard.initHomeView();
    }
}

document.getElementById('version').innerHTML = Dashboard.getVersion();
