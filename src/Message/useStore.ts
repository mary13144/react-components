import {MessageProps, Position} from "./index.tsx";
import {useState} from "react";


type MessageList = {
	top: MessageProps[],
	bottom: MessageProps[]
}

const initialState = {
	top: [],
	bottom: []
}

export default function useStore(defaultPosition: Position) {
	const [messageList, setMessageList] = useState<MessageList>({...initialState})
	return {
		messageList,
		add: (messageProps: MessageProps) => {
			const id = getId(messageProps)
			setMessageList((prevState) => {
				if (messageProps?.id) {
					const position = getMessagePosition(prevState, messageProps.id)
					if (position) {
						return prevState
					}
				}

				const position = messageProps.position || defaultPosition;
				const isTop = position.includes('top');
				const messages = isTop ?
					[{...messageProps, id}, ...(prevState[position] ?? [])] :
					[...(prevState[position] ?? []), {...messageProps, id}]

				return {
					...prevState,
					[position]: messages
				}
			})
			return id
		},
		update: (id: number, messagePros: MessageProps) => {
			if (!id) {
				return
			}
			setMessageList(prevState => {
				const nextState = {...prevState}
				const {position, index} = findMessage(nextState, id)
				if (position && index !== -1) {
					nextState[position][index] = {
						...nextState[position][index],
						...messagePros
					}
				}

				return nextState;
			})
		},
		remove: (id: number) => {
			setMessageList(prevState => {
				const position = getMessagePosition(messageList, id)
				if (!position) {
					return prevState;
				}

				return {
					...prevState,
					[position]: prevState[position].filter(item => item.id !== id)
				}
			})
		},

		clearAll: () => {
			setMessageList({...initialState})
		}
	}
}

let count = 1;

export function getId(messageProps: MessageProps) {
	if (messageProps.id) {
		return messageProps.id
	}
	count++;
	return count;
}

export function getMessagePosition(messageList: MessageList, id: number) {
	for (const [position, list] of Object.entries(messageList)) {
		if (list.find(item => item.id === id)) {
			return position as Position
		}
	}
}

export function findMessage(messageList: MessageList, id: number) {
	const position = getMessagePosition(messageList, id)
	const index = position ? messageList[position].findIndex(item => item.id === id) : -1
	return {
		position,
		index
	}
}
