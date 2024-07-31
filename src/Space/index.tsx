import React from 'react';
import { ConfigContext } from './ConfigProvider';
import styled from 'styled-components';

const StyleSpace = styled.div<{
	$horizontalSize: number;
	$verticalSize: number;
	$warp?: boolean;
	$direction?: string;
	$align?: string;
}>`
	display: inline-flex;
	column-gap: ${(props) => props.$horizontalSize}px;
	row-gap: ${(props) => props.$verticalSize}px;
	flex-wrap: ${(props) => (props.$warp ? 'wrap' : 'nowrap')};
	flex-direction: ${(props) =>
		props.$direction === 'horizontal' ? 'row' : 'column'};
	${(props) =>
		props.$align &&
		`
		align-items:${props.$align}
	`};
`;
export type SizeType = 'small' | 'middle' | 'large' | number | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: React.CSSProperties;
	size?: SizeType | [SizeType, SizeType];
	direction?: 'horizontal' | 'vertical';
	align?: 'flex-start' | 'flex-end' | 'center' | 'baseline';
	split?: React.ReactNode;
	wrap?: boolean;
}

const spaceSize = {
	small: 8,
	middle: 16,
	large: 24,
};

function getNumberSize(size: SizeType) {
	return typeof size === 'string' ? spaceSize[size] : size || 0;
}

const Space: React.FC<SpaceProps> = (props) => {
	const { space } = React.useContext(ConfigContext);

	const {
		className,
		style,
		size = space?.size || 'middle',
		direction = 'horizontal',
		align,
		split,
		wrap = false,
		...otherProps
	} = props;

	const childNodes = React.Children.toArray(props.children);

	const nodes = childNodes.map((child: any, index) => {
		const key = (child && `space-item-${child.key}`);
		return (
			<>
				<div className="space-item" key={key}>
					{child}
				</div>
				{index < childNodes.length - 1 && split && (
					<span className={`${className}-split`} style={style} key={`${key}-spilt`}>
						{split}
					</span>
				)}
			</>
		);
	});

	const [horizontalSize, verticalSize] = React.useMemo(() => {
		const sizes = (Array.isArray(size) ? size : [size, size]) as [
			SizeType,
			SizeType,
		];
		return sizes.map((item) => {
			return getNumberSize(item);
		});
	}, [size]);

	return (
		<StyleSpace
			$horizontalSize={horizontalSize}
			$verticalSize={verticalSize}
			$warp={wrap}
			$align={align}
			$direction={direction}
			className={className}
			style={style}
			{...otherProps}
		>
			{nodes}
		</StyleSpace>
	);
};

export default Space;
