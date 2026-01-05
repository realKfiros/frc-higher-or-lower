import {TCanvasConfettiAnimationOptions} from "react-canvas-confetti/dist/types";

export enum ConfettiPreset {
	Fireworks = 'fireworks',
	Pride = 'pride',
	Crossfire = 'crossfire',
	Snow = 'snow',
	Custom = 'custom',
}

export type ConfettiShoot = {
	preset?: ConfettiPreset;
	text?: string;
	options?: TCanvasConfettiAnimationOptions;
};
