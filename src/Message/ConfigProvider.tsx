import {createContext, PropsWithChildren, RefObject, useRef} from "react";
import {MessageProvider, MessageRef} from "./index.tsx";


interface ConfigProviderProps {
	messageRef?: RefObject<MessageRef>;
}

export const ConfigContext = createContext<ConfigProviderProps>({})

export default function ConfigProvider(props: PropsWithChildren) {
	const {children} = props
	const messageRef = useRef<MessageRef>(null);

	return <ConfigContext.Provider value={{messageRef}}>
		<MessageProvider ref={messageRef}></MessageProvider>
		{children}
	</ConfigContext.Provider>
}