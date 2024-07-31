import { ReactNode, useEffect, useState } from 'react';
import { Button, Popover } from 'antd';
import Mask from './Mask.tsx';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

type TooltipPlacement =
	| 'top'
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
`;

const StyleButton = styled(Button)`
	min-width: 80px;
`;

export default function OnBoarding(props: OnBoardingProps) {
	const { step = 0, steps, getContainer, onStepsEnd } = props;

	const [done, setDone] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const currentSelectElement = steps[currentStep]?.selector();

	const currentContainerElement =
		getContainer?.() || document.documentElement;

	const getCurrentStep = () => {
		return steps[currentStep];
	};

	const back = () => {
		if (currentStep === 0) {
			return;
		}

		const { beforeBack } = getCurrentStep();
		beforeBack?.(currentStep);
		setCurrentStep(currentStep - 1);
	};

	const forward = () => {
		if (currentStep === steps.length - 1) {
			onStepsEnd?.();
			setDone(true);
			return;
		}

		const { beforeForward } = getCurrentStep();
		beforeForward?.(currentStep);
		setCurrentStep(currentStep + 1);
	};


	const renderPopover = (wrapper: ReactNode) => {
		const config = getCurrentStep();
		if (!config) {
			return wrapper;
		}

		const { renderContent } = config;

		const content = renderContent ? renderContent(currentStep) : null;

		const operation = (
			<OnboardingOperation>
				{currentStep !== 0 && (
					<StyleButton
						style={{ marginRight: '12px' }}
						onClick={() => back()}
					>
						{'上一步'}
					</StyleButton>
				)}
				<StyleButton type={'primary'} onClick={() => forward()}>
					{currentStep === steps.length - 1 ? '我知道了' : '下一步'}
				</StyleButton>
			</OnboardingOperation>
		);
		return (
			<Popover
				content={
					<div>
						{content}
						{operation}
					</div>
				}
				open={true}
				placement={config.placement}
			>
				{wrapper}
			</Popover>
		);
	};


	useEffect(() => {
		setCurrentStep(step)
	}, [step]);
	// 这里是为了让元素整体渲染完后才能进行引导
	const [, setRenderTick] = useState<number>(0);

	useEffect(() => {
		setRenderTick(1);
	}, []);

	if (!currentSelectElement || done) {
		return null;
	}

	const mask = (
		<Mask
			container={currentContainerElement}
			element={currentSelectElement}
			renderMaskContent={(wrapper) => renderPopover(wrapper)}
		/>
	);

	return createPortal(mask, currentContainerElement);
}
