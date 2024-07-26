import {CSSProperties, FC, forwardRef, ReactNode, useMemo} from "react";
import useStore from "./useStore.ts";
import './index.scss'
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {createPortal} from "react-dom";
import useTimer from "./useTimer.ts";


export type Position = 'top' | 'bottom';

export interface MessageProps {
	style?: CSSProperties;
	className?: string | string[];
	content: ReactNode;
	duration?: number;
	id?: number;
	position?: Position;
	onClose?: (...args: any) => void
}

export interface MessageRef {
	add: (messageProps: MessageProps) => number;
	remove: (id: number) => void;
	update: (id: number, messageProps: MessageProps) => void;
	clearAll: () => void;
}

const MessageItem: FC<MessageProps> = (props) => {
	const {onMouseEnter, onMouseLeave} = useTimer({
		id: props.id!,
		duration: props.duration,
		remove: props.onClose!
	})

	return <div className={'message-item'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
		{props.content}
	</div>
}


export const MessageProvider = forwardRef<MessageRef, {}>((_props, ref) => {
	const {messageList, add, update, remove, clearAll} = useStore('top')

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
			clearAll
		}
	}

	const positions = Object.keys(messageList) as Position[]

	const messageWrapper = <div className={'message-wrapper'}>
		{
			positions.map(direction => {
				return <TransitionGroup className={`message-wrapper-${direction}`} key={direction}>
					{
						messageList[direction].map(item => {
							return <CSSTransition key={item.id} timeout={1000} classNames={'message'}>
								<MessageItem onClose={remove} {...item}>

								</MessageItem>
							</CSSTransition>
						})
					}
				</TransitionGroup>
			})
		}
	</div>

	const el = useMemo(() => {
		const el = document.createElement('div')
		el.className = 'wrapper';
		document.body.appendChild(el)
		return el
	}, [])

	return createPortal(messageWrapper, el)
})
