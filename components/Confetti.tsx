'use client';
import {useRef} from "react";
import {observer} from "mobx-react-lite";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import Pride from "react-canvas-confetti/dist/presets/pride";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";
import {TCanvasConfettiInstance, TDecorateOptionsFn, TOnInitComponentFn} from "react-canvas-confetti/dist/types";
import Snow from "react-canvas-confetti/dist/presets/snow";
import ReactCanvasConfetti from "react-canvas-confetti";
import canvasConfetti from 'canvas-confetti';
import {confettiStore} from "@/stores/confettiStore";
import {ConfettiPreset} from "@/lib/interfaces/confetti_shoot";

const canvasStyles = {
	position: "fixed",
	pointerEvents: "none",
	width: "100%",
	height: "100%",
	top: 0,
	left: 0,
};

export const Confetti = observer(() =>
{
	const customConfettiInstance = useRef<TCanvasConfettiInstance | null>(null);
	const {run, type, text, options} = confettiStore;

	if (!run)
		return null;

	const autorun = {speed: 50, duration: 2500};

	const decorate: TDecorateOptionsFn = defaults => ({
		...defaults,
		...options || {},
	});

	const onInitCustom: TOnInitComponentFn = ({confetti}) =>
	{
		customConfettiInstance.current = confetti;
		customConfettiInstance.current!({
			scalar: 10,
			spread: 300,
			gravity: 2,
			origin: {
				y: -.1
			},
			...options,
			shapes: [canvasConfetti.shapeFromText({text, scalar: 10})],
		})
	}

	switch (type)
	{
		case ConfettiPreset.Fireworks:
			return <Fireworks autorun={autorun} style={canvasStyles as object}/>;
		case ConfettiPreset.Pride:
			return <Pride autorun={autorun} decorateOptions={decorate} style={canvasStyles as object}/>;
		case ConfettiPreset.Crossfire:
			return <Crossfire autorun={autorun} style={canvasStyles as object}/>;
		case ConfettiPreset.Snow:
			return <Snow autorun={autorun} style={canvasStyles as object}/>;
		case ConfettiPreset.Custom:
			return <ReactCanvasConfetti onInit={onInitCustom} globalOptions={{resize: true}} style={canvasStyles as object} />;
		default:
			return null;
	}
});
