import React, { PropsWithChildren, forwardRef } from "react";
import cs from 'classnames';
import './index.scss';


export const getSize = (size: IconProps['size']) => {
    if (Array.isArray(size) && size.length === 2) {
        return size as string[]
    }
    const width = (size as string) || '1em'
    const height = (size as string) || '1em'
    return [width, height]
}


type BaseIconProps = {
    className?: string;
    style?: React.CSSProperties;
    size?: string | string[];
    spin?: boolean
}


export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>((props, ref) => {
    const {
        className,
        style,
        size='1em',
        spin,
        children,
        ...rest
    } = props

    const [width, height] = getSize(size)
    
    const cn = cs(
        "icon",
        {
            'icon-spin': spin
        },
        className
    )

    return <svg ref={ref} style={style} width={width} height={height} fill="currentColor" {...rest}>
        {children}
    </svg>
})
