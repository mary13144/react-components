import {ReactNode, useEffect, useState} from "react";
import {Button, Popover} from "antd";
import Mask from "./Mask.tsx";
import {createPortal} from "react-dom";
import styled from "styled-components";


type TooltipPlacement =
	'top'
	| 'left'
	| 'right'
	| 'bottom'
	| 'topLeft'
	| 'topRight'
	| 'bottomLeft'
	| 'bottomRight'
	| 'leftTop'
	| 'leftBottom'
	| 'rightTop'
	| 'rightBottom';

export interface OnBoardingStepConfig {
	selector: () => HTMLElement | null;
	placement?: TooltipPlacement;
	renderContent?: (currentStep: number) => ReactNode;
	beforeForward?: (currentStep: number) => void;
	beforeBack?: (currentStep: number) => void;
}

export interface OnBoardingProps {
	step?: number;
	steps: OnBoardingStepConfig[];
	getContainer?: () => HTMLElement;
	onStepsEnd?: () => void;
}

const OnboardingOperation = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 12px;
`

const ButtonStyle = styled(Button)`
	min-width: 80px;
`


export default function OnBoarding(props: OnBoardingProps) {
	const {
		step = 0,
		steps,
		getContainer,
		onStepsEnd,
	} = props

	const [done, setDone] = useState<boolean>(false)
	// const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false)
	const [currentStep, setCurrentStep] = useState<number>(0)
	const currentSelectElement = steps[currentStep]?.selector()

	const currentContainerElement = getContainer?.() || document.documentElement;

	const getCurrentStep = () => {
		return steps[currentStep]
	}

	const back = async () => {
		if (currentStep === 0) {
			return;
		}

		const {beforeBack} = getCurrentStep();
		await beforeBack?.(currentStep);
		setCurrentStep(currentStep - 1);
	}

	const forward = async () => {
		if (currentStep === steps.length - 1) {
			await onStepsEnd?.();
			setDone(true)
			return;
		}

		const {beforeForward} = getCurrentStep();
		await beforeForward?.(currentStep);
		setCurrentStep(currentStep + 1);
	}

	useEffect(() => {
		setCurrentStep(step!)
	}, [step]);

	const renderPopover = (wrapper: ReactNode) => {
		const config = getCurrentStep();
		if (!config) {
			return wrapper;
		}

		const {renderContent} = config

		const content = renderContent ? renderContent(currentStep) : null;


		const operation = (
			<OnboardingOperation>
				{
					currentStep !== 0 &&
					<ButtonStyle
						style={{marginRight: '12px'}}
						onClick={() => back()}
					>
						{'上一步'}
					</ButtonStyle>
				}
				<ButtonStyle
					type={'primary'}
					className={'forward'}
					onClick={() => forward()}
				>
					{currentStep === steps.length - 1 ? '我知道了' : '下一步'}
				</ButtonStyle>
			</OnboardingOperation>
		)

		return (
			// isMaskMoving ? wrapper :
			<Popover
				content={
					<div>
						{content}
						{operation}
					</div>
				}
				open={true}
				placement={getCurrentStep()?.placement}>
				{wrapper}
			</Popover>
		)

	}

	const [, setRenderTick] = useState<number>(0)

	useEffect(() => {
		setRenderTick(1)
	}, []);

	if (!currentSelectElement || done) {
		return null
	}

	const mask = <Mask
		// onAnimationStart={() => {
		// 	setIsMaskMoving(true)
		// }}
		// onAnimationEnd={() => {
		// 	setIsMaskMoving(false)
		// }}
		container={currentContainerElement}
		element={currentSelectElement}
		renderMaskContent={(wrapper) => renderPopover(wrapper)}/>

	return createPortal(mask, currentContainerElement)
}

