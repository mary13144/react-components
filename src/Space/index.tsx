import React from "react";
import "./index.scss";
import classNames from "classnames";
import { ConfigContext } from "./ConfigProvider";
export type SizeType = "small" | "middle" | "large" | number | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: React.CSSProperties;
	size?: SizeType | [SizeType, SizeType];
	direction?: "horizontal" | "vertical";
	align?: "start" | "end" | "center" | "baseline";
	split?: React.ReactNode;
	wrap?: boolean;
}

const spaceSize = {
	small: 8,
	middle: 16,
	large: 24,
};

function getNumberSize(size: SizeType) {
	return typeof size === "string" ? spaceSize[size] : size || 0;
}

const Space: React.FC<SpaceProps> = (props) => {
	const { space } = React.useContext(ConfigContext);
	const {
		className,
		style,
		size = space?.size || "middle",
		direction = "horizontal",
		align,
		split,
		wrap = false,
		...otherProps
	} = props;

	const childNodes = React.Children.toArray(props.children);

	const mergeAlign =
		direction === "horizontal" && align === undefined ? "center" : align;

	const cn = classNames(
		"space",
		`space-${direction}`,
		{
			[`space-align-${mergeAlign}`]: mergeAlign,
		},
		className
	);

	const nodes = childNodes.map((child: any, index) => {
		const key = (child && child.key) || `space-item-${index}`;

		return (
			<>
				<div className="space-item" key={key}>
					{child}
				</div>
				{index < childNodes.length && split && (
					<span className={`${className}-split`} style={style}>
						{split}
					</span>
				)}
			</>
		);
	});

	const otherStyles: React.CSSProperties = {};
	const [horizontalSize, verticalSize] = React.useMemo(() => {
		let sizes = (Array.isArray(size) ? size : [size, size]) as [
			SizeType,
			SizeType
		];
		return sizes.map((item) => {
			return getNumberSize(item);
		});
	}, [size]);

	otherStyles.columnGap = horizontalSize;
	otherStyles.rowGap = verticalSize;

	if (wrap) {
		otherStyles.flexWrap = "wrap";
	}

	return (
		<div
			className={cn}
			style={{
				...otherStyles,
				...style,
			}}
			{...otherProps}
		>
			{nodes}
		</div>
	);
};

export default Space;
