import { Icon, IconProps } from '.';
import React, { forwardRef } from 'react';

interface CreateIconOptions {
	content: React.ReactNode;
	iconProps?: IconProps;
	viewBox?: string;
}

export function CreateIcon(options: CreateIconOptions) {
	const { content, iconProps = {}, viewBox = '0 0 1024 1024' } = options;

	return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
		return (
			<Icon ref={ref} viewBox={viewBox} {...iconProps} {...props}>
				{content}
			</Icon>
		);
	});
}
