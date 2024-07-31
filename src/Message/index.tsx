import { CSSProperties, FC, forwardRef, ReactNode, useMemo } from 'react';
import useStore from './useStore.ts';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createPortal } from 'react-dom';
import useTimer from './useTimer.ts';
import styled from 'styled-components';

const StyleMessageItem = styled.div`
	margin-bottom: 12px;
	padding: 10px 16px;
	line-height: 14px;
	font-size: 14px;
	border: 1px solid #ccc;
	box-shadow: 0 0 3px #ccc;
	pointer-events: all;
`;

const StyleMessageWrapper = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
`;

const StyleMessageWrapperTop = styled.div`
	position: absolute;
	top: 20px;
`;

const StyleMessageWrapperBottom = styled.div`
	position: absolute;
	bottom: 20px;
`;
const StyleCSSTransition = styled(CSSTransition)<{ $classPrefix: string }>`
	&.${(props) => props.$classPrefix}-enter {
		opacity: 0;
		transform: scale(1.1);
	}
	&.${(props) => props.$classPrefix}-enter-active {
		opacity: 1;
		transform: scale(1);
		transition:
			opacity,
			transform 1s ease;
	}
	&.${(props) => props.$classPrefix}-exit {
		opacity: 1;
	}
	&.${(props) => props.$classPrefix}-exit-active {
		opacity: 0;
		transition: opacity 1s ease;
	}
`;

export type Position = 'top' | 'bottom';

export interface MessageProps {
	style?: CSSProperties;
	className?: string | string[];
	content: ReactNode;
	duration?: number;
	id?: number;
	position?: Position;
	onClose?: (...args: any) => void;
}

export interface MessageRef {
	add: (messageProps: MessageProps) => number;
	remove: (id: number) => void;
	update: (id: number, messageProps: MessageProps) => void;
	clearAll: () => void;
}

const MessageItem: FC<MessageProps> = (props) => {
	const { onMouseEnter, onMouseLeave } = useTimer({
		id: props.id!,
		duration: props.duration,
		remove: props.onClose!,
	});

	return (
		<StyleMessageItem
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{props.content}
		</StyleMessageItem>
	);
};

export const MessageProvider = forwardRef<MessageRef, {}>((_props, ref) => {
	const { messageList, add, update, remove, clearAll } = useStore('top');

	// useImperativeHandle(ref, () => {
	// 	return {
	// 		add,
	// 		remove,
	// 		update,
	// 		clearAll
	// 	}
	// })

	if ('current' in ref!) {
		ref.current = {
			add,
			remove,
			update,
			clearAll,
		};
	}

	const positions = Object.keys(messageList) as Position[];

	const messageWrapper = (
		<StyleMessageWrapper>
			{positions.map((direction) => {
				return (
					<TransitionGroup
						component={
							direction === 'top'
								? StyleMessageWrapperTop
								: StyleMessageWrapperBottom
						}
						key={direction}
					>
						{messageList[direction].map((item) => {
							return (
								<StyleCSSTransition
									key={item.id}
									timeout={1000}
									$classPrefix={'message'}
								>
									<MessageItem
										onClose={remove}
										{...item}
									></MessageItem>
								</StyleCSSTransition>
							);
						})}
					</TransitionGroup>
				);
			})}
		</StyleMessageWrapper>
	);

	const el = useMemo(() => {
		const el = document.createElement('div');
		el.className = 'wrapper';
		document.body.appendChild(el);
		return el;
	}, []);

	return createPortal(messageWrapper, el);
});
