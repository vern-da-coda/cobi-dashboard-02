import Core from './core';
import Dashboard from '../dashboard';

//import * as Konva from 'konva';
declare let Konva: any;

/**
 *
 */
export default class View {

    private core: Core = null;

    private stageWidth: number;
    private stageHeight: number;
    private stageContainer: string;

    private arcBackgroundColor: string = '#444353';
    private arcBackgroundShadowColor: string = '#444353';
    private arcForeGroundColor: string = '#00C8E6';
    private arcForeGroundShadowColor: string = '#00C8E6';
    private arcPointerColor: string = '#FFF';
    private arcPointerShadowColor: string = '#FFF';

    private cadenceArcX: number = 0;
    private cadenceArcY: number = 0;
    private acrToBackground: number = 5;

    private checkSpeedInterval: number = 1000;
    private checkSpeedIntervalObject = null;
    private lastSpeedUpdate: number = 0;

    private speedArcX: number;
    private speedArcY: number;
    private speedArcWidth: number;
    private arcInnerRadius: number;

    private arcOuterRadius: number;
    private averageCadenceInterval: number = 1000;
    private averageCadenceIntervalObject = null;

    private lastCadenceUpdate: number = 0;
    private checkCadenceInterval: number = 1000;

    private checkCadenceIntervalObject = null;
    private cadenceArcInnerRadius: number;

    private cadenceArcOuterRadius: number;
    private stage;
    private layer;

    private mask;
    private speedDisplayFull;
    private speedDisplayDecimal;
    private speedArcBackground;
    private curSpeedArc;
    private averageSpeedArc;
    private averageCadenceArc;
    private cadenceArcBackground;
    private curCadenceArc;

    /**
     *
     */
    constructor(core: Core, stageContainer: string, stageWidth: number, stageHeight: number) {
        this.core = core;

        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.stageContainer = stageContainer;

        this.speedArcWidth = this.stageHeight * 0.05;
        this.arcOuterRadius = this.stageHeight * 0.9 / 2;
        this.arcInnerRadius = this.arcOuterRadius - this.speedArcWidth;

        this.cadenceArcInnerRadius = this.arcInnerRadius - 55;
        this.cadenceArcOuterRadius = this.arcOuterRadius - 25;
    }

    /**
     *
     */
    initView() {
        this.stage =
            new Konva.Stage(
                {
                    container: this.stageContainer,
                    width: this.stageWidth,
                    height: this.stageHeight
                }
            );

        this.speedArcX = this.arcOuterRadius + (this.stageWidth * 0.02);
        this.speedArcY = this.stageHeight / 2;

        this.cadenceArcX = this.stageWidth - this.arcOuterRadius - (this.stageWidth * 0.02);
        this.cadenceArcY = this.stageHeight / 2;

        this.layer = new Konva.Layer();

        this.mask =
            new Konva.Group(
                {

                    clip: {
                        x: 0,
                        y: 0,
                        width: this.stageWidth,
                        height: this.stageHeight
                    }

                }
            );

        this.speedArcBackground =
            new Konva.Arc(
                {
                    x: this.speedArcX,
                    y: this.speedArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcBackgroundColor,
                    rotation: 90
                }
            );

        this.curSpeedArc =
            new Konva.Arc(
                {
                    x: this.speedArcX,
                    y: this.speedArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcForeGroundColor,
                    rotation: 90,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcForeGroundShadowColor
                }
            );

        this.averageSpeedArc =
            new Konva.Arc(
                {
                    x: this.speedArcX,
                    y: this.speedArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 2,
                    opacity: 0.9,
                    fill: this.arcPointerColor,
                    rotation: 90,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcPointerShadowColor
                }
            );

        this.averageCadenceArc =
            new Konva.Arc(
                {
                    x: this.cadenceArcX,
                    y: this.cadenceArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 2,
                    opacity: 0.9,
                    fill: this.arcPointerColor,
                    rotation: 270,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcPointerShadowColor
                }
            );

        this.cadenceArcBackground =
            new Konva.Arc(
                {
                    x: this.cadenceArcX,
                    y: this.cadenceArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcBackgroundColor,
                    rotation: 270
                }
            );

        this.curCadenceArc =
            new Konva.Arc(
                {
                    x: this.cadenceArcX,
                    y: this.cadenceArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcForeGroundColor,
                    rotation: 270,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcForeGroundShadowColor
                }
            );

        this.speedDisplayFull = new Konva.Text(
            {
                x: this.stageWidth / 2.3,
                y: this.cadenceArcY - 95,
                width: this.stageWidth / 4,
                text: '0',
                fontSize: 110,
                fontFamily: 'UniSans',
                fill: '#fff',
                align: 'right',
                shadowEnabled: true,
                shadowBlur: 5,
                shadowColor: '#fff'
            }
        );

        this.speedDisplayDecimal = new Konva.Text(
            {
                x: this.stageWidth / 2.3 + this.stageWidth / 4 + 15,
                y: this.cadenceArcY - 55,
                width: this.stageWidth / 5,
                text: '0',
                fontSize: 50,
                fontFamily: 'UniSans',
                fill: '#fff',
                align: 'left',
                shadowEnabled: true,
                shadowBlur: 5,
                shadowColor: '#fff'
            }
        );

        this.mask.add(this.speedArcBackground);
        this.mask.add(this.cadenceArcBackground);

        this.mask.add(this.curSpeedArc);
        this.mask.add(this.averageSpeedArc);

        this.mask.add(this.curCadenceArc);
        this.mask.add(this.averageCadenceArc);

        this.layer.add(this.mask);
        this.layer.add(this.speedDisplayFull);
        this.layer.add(this.speedDisplayDecimal);

        this.stage.add(this.layer);

        document.getElementById('version').innerHTML = Dashboard.getVersion();
    }

    /**
     *
     */
    initAverageSpeedView() {
        this.core.setMaxSpeed(this.core.getMaxSpeed());
        this.updateAverageSpeedView(this.core.getAverageSpeed(), true);
    }

    /**
     *
     */
    initAverageCadenceView() {
        this.core.setMaxCadence(this.core.getMaxCadence());
        this.updateAverageCadenceView(this.core.getAverageCadence(), true);

        if (this.averageCadenceIntervalObject === null) {
            this.averageCadenceIntervalObject =
                setInterval(() => {
                    this.updateAverageCadenceView(this.core.getAverageCadence(), false);
                }, this.averageCadenceInterval);
        }
    }

    /**
     *
     */
    initSpeedCheck() {
        if (this.checkSpeedIntervalObject === null) {
            this.checkSpeedIntervalObject =
                setInterval(() => {
                    if (new Date().getTime() - this.lastSpeedUpdate >
                        this.checkSpeedInterval) {
                        this.updateCurrentSpeedView(0);
                    }
                }, this.checkSpeedInterval);
        }
    }

    /**
     *
     */
    initCadenceCheck() {
        if (this.checkCadenceIntervalObject === null) {
            this.checkCadenceIntervalObject =
                setInterval(() => {
                    if (new Date().getTime() - this.lastCadenceUpdate >
                        this.checkCadenceInterval) {
                        this.updateCurrentCadenceView(0);
                    }
                }, this.checkCadenceInterval);
        }
    }

    /**
     * @param {number} speed
     */
    updateCurrentSpeedView(speed: number) {
        this.lastSpeedUpdate = new Date().getTime();

        speed = Core.round(speed);

        let speedFull = Core.decimal(speed).split('.');

        this.speedDisplayFull.text(speedFull[0]);
        this.speedDisplayDecimal.text(speedFull[1]);

        this.core.setMaxSpeed(speed);

        let opacity = 1;
        if (speed === 0) {
            opacity = 0;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.curSpeedArc,
                    angle: this.core.calculateSpeedBasedRotation(speed),
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity: opacity
                }
            );

        tween.play();

        document.getElementById('speed').innerHTML =
            Core.decimal(speed) +
            ' > ' +
            this.core.getAverageSpeed() +
            ' - (' +
            this.core.getMaxSpeed() +
            '/' +
            this.core.getMaxSpeedCeiling() + ')';
    }

    /**
     * @param {number} cadence
     */
    updateCurrentCadenceView(cadence: number) {
        this.lastCadenceUpdate = new Date().getTime();

        cadence = Core.round(cadence);

        this.core.setMaxCadence(cadence);
        this.core.setAverageCadence(cadence);

        let opacity = 1;
        if (cadence === 0) {
            opacity = 0;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.curCadenceArc,
                    angle: this.core.calculateCadenceBasedRotation(cadence),
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity: opacity
                }
            );

        tween.play();

        document.getElementById('cadence').innerHTML =
            Core.decimal(cadence) +
            ' > ' +
            this.core.getAverageCadence() +
            ' - (' +
            this.core.getMaxCadence() +
            '/' +
            this.core.getMaxCadenceCeiling() + ')';
    }

    /**
     * @param {number} speed
     * @param {boolean} initial
     */
    updateAverageSpeedView(speed: number, initial: boolean = false) {
        speed = Core.round(speed);

        this.core.setAverageSpeed(speed);

        let duration = 0.5;
        if (initial === true) {
            duration = 5;
        }

        let rotation = 0;
        if (speed !== 0) {
            rotation = this.core.calculateSpeedBasedRotation(speed) + 90;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.averageSpeedArc,
                    rotation: rotation,
                    easing: Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );

        tween.play();
    }

    /**
     * @param {number} cadence
     * @param {boolean} initial
     */
    updateAverageCadenceView(cadence: number, initial: boolean = false) {
        cadence = Core.round(cadence);

        this.core.setAverageCadence(cadence);

        let duration = 0.5;
        if (initial === true) {
            duration = 5;
        }

        let rotation = 0;
        if (cadence !== 0) {
            rotation = this.core.calculateCadenceBasedRotation(cadence) + 180;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.averageCadenceArc,
                    rotation: rotation,
                    easing: Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );

        tween.play();
    }
}
