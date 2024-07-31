import {
	CSSProperties,
	PropsWithChildren,
	useRef,
	useCallback,
	useEffect,
	FC,
} from 'react';
import useWatermark from './useWatermark';

export interface WatermarkProps extends PropsWithChildren {
	style?: CSSProperties;
	className?: string;
	zIndex?: string | number;
	width?: number;
	height?: number;
	rotate?: number; // 水印旋转角度
	image?: string; // 图片地址
	content?: string | string[];
	fontStyle?: {
		color?: string;
		fontFamily?: string;
		fontSize?: string | number;
		fontWeight?: string | number;
	};
	gap?: [number, number];
	offset?: [number, number];
	getContainer?: () => HTMLElement;
}

const Watermark: FC<WatermarkProps> = (props) => {
	const {
		style,
		className,
		zIndex,
		width,
		height,
		rotate,
		image,
		content,
		fontStyle,
		gap,
		offset,
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);

	const getContainer = useCallback(() => {
		return props.getContainer
			? props.getContainer()
			: containerRef.current!;
	}, [props.getContainer, containerRef.current]);

	const Watermark = useWatermark({
		zIndex,
		width,
		height,
		rotate,
		image,
		content,
		fontStyle,
		gap,
		offset,
		getContainer,
	});

	useEffect(() => {
		Watermark.generateWatermark({
			zIndex,
			width,
			height,
			rotate,
			image,
			content,
			fontStyle,
			gap,
			offset,
			getContainer,
		});
	}, [
		zIndex,
		width,
		height,
		rotate,
		image,
		content,
		JSON.stringify(props.fontStyle),
		JSON.stringify(props.gap),
		JSON.stringify(props.offset),
		getContainer,
	]);

	return props.children ? (
		<div className={className} style={style} ref={containerRef}>
			{props.children}
		</div>
	) : null;
};

export default Watermark;
