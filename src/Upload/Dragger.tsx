import {DragEvent, FC, PropsWithChildren, useState} from "react";
import styled, {css} from "styled-components";

interface DraggerProps extends PropsWithChildren {
	onFile: (files: FileList) => void
}

const DivStyle = styled.div<{ $dragOver: boolean }>`
	background: #eee;
	border: 1px dashed #aaa;
	border-radius: 4px;
	cursor: pointer;
	padding: 20px;
	width: 200px;
	height: 100px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	${props => {
		return props.$dragOver && css`
			border: 2px dashed blue;
			background: rgba(0, 128, 255, .3);
		`
	}}
`

const Dragger: FC<DraggerProps> = (props) => {
	const {onFile, children} = props

	const [dragOver, setDragOver] = useState<boolean>(false);

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault()
		setDragOver(false)
		onFile(e.dataTransfer.files)
	}

	const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
		e.preventDefault()
		setDragOver(over)
	}

	return <DivStyle
		$dragOver={dragOver}
		onDragLeave={e => handleDrag(e, false)}
		onDragOver={e => handleDrag(e, true)}
		onDrop={e => handleDrop(e)}>
		{children}
	</DivStyle>
}

export default Dragger;