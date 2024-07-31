import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	LoadingOutlined,
} from '@ant-design/icons';
import { Progress } from 'antd';
import styled from 'styled-components';

export interface UploadFile {
	uid: string;
	size: number;
	name: string;
	status: 'ready' | 'uploading' | 'success' | 'error';
	percent?: number;
	raw?: File;
	response?: any;
	error?: any;
}

interface UploadListProps {
	fileList: UploadFile[];
	onRemove: (file: UploadFile) => void;
}

const Ulstyle = styled.ul`
	margin: 0;
	padding: 0;
	list-style-type: none;
`;

const Listyle = styled.li<{
	$status: UploadFile['status'];
}>`
	margin-top: 5px;
	font-size: 14px;
	line-height: 2em;
	font-weight: bold;
	box-sizing: border-box;
	min-width: 200px;
	position: relative;
	color: ${(props) => (props.$status === 'error' ? 'red' : 'blue')};
`;

const SpanStyle = styled.span`
	display: none;
	position: absolute;
	right: 7px;
	top: 0;
	cursor: pointer;

	${Listyle}:hover & {
		display: block;
	}
`;

export const UploadList = (props: UploadListProps) => {
	const { fileList, onRemove } = props;

	return (
		<Ulstyle>
			{fileList.map((item) => (
				<Listyle $status={item.status} key={item.uid}>
					<span>
						{(item.status === 'uploading' ||
							item.status === 'ready') && <LoadingOutlined />}
						{item.status === 'success' && <CheckOutlined />}
						{item.status === 'error' && <CloseOutlined />}
						{item.name}
					</span>
					<SpanStyle>
						<DeleteOutlined onClick={() => onRemove(item)} />
					</SpanStyle>
					{item.status === 'uploading' && (
						<Progress percent={item.percent || 0} />
					)}
				</Listyle>
			))}
		</Ulstyle>
	);
};
