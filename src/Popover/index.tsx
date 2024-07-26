import {CSSProperties, PropsWithChildren, ReactNode, useRef, useState} from "react";
import {
	arrow,
	flip, FloatingArrow,
	offset,
	useClick,
	useDismiss,
	useFloating,
	useHover,
	useInteractions
} from "@floating-ui/react";
import './index.scss'

type Alignment = 'start' | 'end';
type Slide = 'top' | 'right' | 'bottom' | 'left';
type AlignedPlacement = `${Slide}-${Alignment}`

interface PopoverProps extends PropsWithChildren {
	content: ReactNode;
	trigger?: 'hover' | 'click';
	placement?: Slide | AlignedPlacement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
	style?: CSSProperties;
	title?: string;
}

export default function Popover(props: PopoverProps) {
	const {
		content,
		title = 'Title',
		trigger = 'hover',
		placement = 'bottom',
		open,
		onOpenChange,
		className,
		style,
		children
	} = props

	const arrowRef = useRef(null)
	const [isOpen, setIsOpen] = useState(open)
	const {refs, floatingStyles, context} = useFloating({
		open: open,
		onOpenChange(open) {
			setIsOpen(open)
			onOpenChange?.(open)
		},
		placement: placement,
		middleware: [
			offset(10),
			flip(),
			arrow({
				element: arrowRef
			})
		]
	})

	const interaction = trigger === 'hover' ? useHover(context) : useClick(context)

	const dismiss = useDismiss(context)

	const {getReferenceProps, getFloatingProps} = useInteractions([
		interaction,
		dismiss
	])

	return (
		<>
		<span ref={refs.setReference} {...getReferenceProps()} className={className} style={style}>
			{children}
		</span>
			{
				isOpen &&
				<div ref={refs.setFloating} {...getFloatingProps()} className='popover-floating' style={floatingStyles}>
					<div className='popover-title'>{title}</div>
					{content}
					<FloatingArrow context={context} ref={arrowRef} fill="#fff" stroke="#000"/>
				</div>
			}
		</>
	)

}