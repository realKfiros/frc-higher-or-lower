import {makeAutoObservable} from "mobx";
import {type TCanvasConfettiAnimationOptions} from "react-canvas-confetti/dist/types";
import {ConfettiPreset, type ConfettiShoot} from "@/lib/interfaces/confetti_shoot";

class ConfettiStore {
	run = false;
	type?: ConfettiPreset;
	options?: TCanvasConfettiAnimationOptions;
	text: string = '';

	constructor() {
		makeAutoObservable(this);
	}

	shoot({preset, text, options}: ConfettiShoot) {
		this.type = preset;
		this.text = text || '';
		this.options = options;
		this.run = true;
		setTimeout(() => this.run = false, 5000);
	}
}

export const confettiStore = new ConfettiStore();
