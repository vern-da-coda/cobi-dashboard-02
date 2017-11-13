import Core from './components/core';
import ExperienceView from './components/views/experience';

/**
 *
 */
export default class Dashboard {

    private static version: string = '0.2.0';

    private stageContainer: string;
    private stageWidth: number;
    private stageHeight: number;

    private core: Core = null;
    private experienceView: ExperienceView = null;

    /**
     *
     */
    constructor(stageContainer: string, stageWidth: number, stageHeight: number) {
        this.core = new Core();

        this.stageContainer = stageContainer;
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
    }

    /**
     *
     */
    initExperienceView() {

        document.getElementById(this.stageContainer).classList.remove('hidden');

        this.experienceView =
            new ExperienceView(
                this.core,
                this.stageContainer,
                this.stageWidth,
                this.stageHeight
            );

        this.experienceView.initView();
        this.experienceView.initAverageSpeedView();
        this.experienceView.initAverageCadenceView();
        this.experienceView.initSpeedCheck();
        this.experienceView.initCadenceCheck();
    }

    /**
     *
     */
    initHomeView() {

        document.getElementById('home').classList.remove('hidden');

        document.getElementById('max-speed').innerHTML =
            this.core.getMaxSpeed() + ' km/h';

        document.getElementById('avr-speed').innerHTML =
            this.core.getAverageSpeed() + ' km/h';

    }

    /**
     * @param {number} speed
     */
    updateCurrentSpeedView(speed: number) {
        this.experienceView.updateCurrentSpeedView(speed);
    }

    /**
     * @param {number} cadence
     */
    updateCurrentCadenceView(cadence: number) {
        this.experienceView.updateCurrentCadenceView(cadence);
    }

    /**
     * @param {number} speed
     * @param {boolean} initial
     */
    updateAverageSpeedView(speed: number, initial: boolean = false) {
        this.experienceView.updateAverageSpeedView(speed, initial);
    }

    /**
     * @returns {string}
     */
    static getVersion() {
        return this.version;
    }
}
