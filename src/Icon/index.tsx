import React, { PropsWithChildren, forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

const spinAnimation = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`;

const StyleIcon = styled.svg<{ $spin: boolean | undefined }>`
	display: inline-block;
	${(props) =>
		props.$spin &&
		css`
			animation: ${spinAnimation} 1s linear infinite;
		`}
`;

type BaseIconProps = {
	className?: string;
	style?: React.CSSProperties;
	size?: string | string[];
	spin?: boolean;
};

export type IconProps = BaseIconProps &
	Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

const getSize = (size: IconProps['size']) => {
	if (Array.isArray(size) && size.length === 2) {
		return size as string[];
	}
	const width = (size as string) || '1em';
	const height = (size as string) || '1em';
	return [width, height];
};

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(
	(props, ref) => {
		const {
			className,
			style,
			size = '1em',
			spin,
			children,
			...rest
		} = props;

		const [width, height] = getSize(size);

		return (
			<StyleIcon
				$spin={spin}
				ref={ref}
				className={className}
				style={style}
				width={width}
				height={height}
				fill="currentColor"
				{...rest}
			>
				{children}
			</StyleIcon>
		);
	}
);
