import {
	CSSProperties,
	PropsWithChildren,
	ReactNode,
	useRef,
	useState,
} from 'react';
import {
	arrow,
	flip,
	FloatingArrow,
	offset,
	useClick,
	useDismiss,
	useFloating,
	useHover,
	useInteractions,
} from '@floating-ui/react';
import styled from 'styled-components';

const StylePopoverFloating = styled.div`
	padding: 12px;
	border-radius: 8px;
	box-shadow:
		0 6px 16px 0 rgba(0, 0, 0, 0.08),
		0 3px 6px -4px rgba(0, 0, 0, 0.12),
		0 9px 28px 8px rgba(0, 0, 0, 0.05);
	background-color: #ffffff;
	background-clip: padding-box;
`;

const StylePopoverTitle = styled.div`
	color: rgba(0, 0, 0, 0.88);
	font-weight: 600;
	margin-bottom: 8px;
`;

const StyleReference = styled.span`
	min-width: 20px;
	min-height: 20px;
`

type Alignment = 'start' | 'end';
export type Slide = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Slide}-${Alignment}`;

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
		children,
	} = props;

	const arrowRef = useRef(null);
	const [isOpen, setIsOpen] = useState(open);
	const { refs, floatingStyles, context } = useFloating({
		open: open,
		onOpenChange(open) {
			setIsOpen(open);
			onOpenChange?.(open);
		},
		placement: placement,
		middleware: [
			offset(10),
			flip(),
			arrow({
				element: arrowRef,
			}),
		],
	});

	const interaction =
		trigger === 'hover' ? useHover(context) : useClick(context);

	const dismiss = useDismiss(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([
		interaction,
		dismiss,
	]);

	return (
		<>
			<StyleReference
				ref={refs.setReference}
				{...getReferenceProps()}
				className={className}
				style={style}
			>
				{children}
			</StyleReference>
			{isOpen && (
				<StylePopoverFloating
					ref={refs.setFloating}
					{...getFloatingProps()}
					style={floatingStyles}
				>
					<StylePopoverTitle>{title}</StylePopoverTitle>
					{content}
					<FloatingArrow
						context={context}
						ref={arrowRef}
						fill="#fff"
						stroke="#000"
					/>
				</StylePopoverFloating>
			)}
		</>
	);
}
