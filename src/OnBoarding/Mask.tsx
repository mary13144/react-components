import {CSSProperties, ReactNode, useEffect, useState} from "react";
import getMaskStyle from "./getMaskStyle.ts";
import styled from "styled-components";

interface MaskProps {
	element: HTMLElement;
	container?: HTMLElement;
	className?: string;
	// onAnimationStart?: () => void;
	// onAnimationEnd?: () => void
	renderMaskContent?: (wrapper: ReactNode) => ReactNode;
}


export function BaseMask(props: MaskProps) {
	const {
		element,
		container,
		className,
		// onAnimationEnd,
		// onAnimationStart,
		renderMaskContent,
	} = props

	const [style, setStyle] = useState<CSSProperties>({})

	useEffect(() => {
		const observer = new ResizeObserver(() => {
			const style = getMaskStyle(element, container || document.documentElement);
			setStyle(style)
		})

		observer.observe(container || document.documentElement)
		return () => {
			observer.unobserve(container || document.documentElement)
		}
	}, [element]);

	// useEffect(() => {
	// 	onAnimationStart?.()
	// 	const timer = setTimeout(() => {
	// 		onAnimationEnd?.()
	// 	}, 200)
	// 	return () => {
	// 		clearTimeout(timer)
	// 	}
	// }, [element]);

	useEffect(() => {
		if (!element) {
			return;
		}

		setTimeout(() => {
			element.scrollIntoView({
				block: 'center',
				inline: 'center'
			});
		}, 200)


		const style = getMaskStyle(element, container || document.documentElement);

		setStyle(style)

	}, [element, container])

	const getContent = () => {
		if (!renderMaskContent) {
			return null
		}

		return renderMaskContent(
			<div className={'mask-content'} style={{width: "100%", height: '100%'}}></div>
		)
	}

	return <div style={style} className={className}>
		{getContent()}
	</div>
}

const Mask = styled(BaseMask)`
	position: absolute;
	left: 0;
	top: 0;
	z-index: 999;
	border-style: solid;
	box-sizing: border-box;
	border-color: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out;
`

export default Mask;


