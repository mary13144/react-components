import { ChangeEvent, PropsWithChildren, useRef, useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import styled from 'styled-components';
import { UploadFile, UploadList } from './UploadList.tsx';
import Dragger from './Dragger.tsx';

export interface UploadProps extends PropsWithChildren {
	/**
	 * @description  上传的地址
	 */
	action: string;
	/**
	 * @description 设置上传的请求头
	 */
	headers?: Record<string, any>;
	/**
	 * @description 发送后台文件的参数名
	 */
	name?: string;
	/**
	 * @description 携带的数据
	 */
	data?: Record<string, any>;
	/**
	 * @description 上传请求时是否携带 cookie
	 */
	withCredentials?: boolean;
	/**
	 * @description	接受上传的文件类型
	 */
	accept?: string;
	/**
	 * @description	是否支持多选文件
	 */
	multiple?: boolean;
	/**
	 * @description 上传之前的回调函数
	 * @param file 文件
	 */
	beforeUpload?: (file: File) => boolean | Promise<File>;
	/**
	 * @description 上传过程中的回调函数
	 * @param percentage 百分比
	 * @param file 文件
	 */
	onProgress?: (percentage: number, file: File) => void;
	/**
	 * @description 上传成功的回调函数
	 * @param data
	 * @param file
	 */
	onSuccess?: (data: any, file: File) => void;
	/**
	 * @description 上传失败的回调函数
	 * @param err
	 * @param file
	 */
	onError?: (err: Error, file: File) => void;
	/**
	 * @description 上传文件状态变化回调函数
	 * @param file
	 */
	onChange?: (file: File) => void;
	/**
	 * @description 移除上传文件回调函数
	 * @param file
	 */
	onRemove?: (file: UploadFile) => void;
	/**
	 * @description 是否支持拖拽上传
	 */
	drag: boolean;
}

const UploadComponent = styled.div``;

const UploadInput = styled.div`
	display: inline-block;
`;

const UploadFileInput = styled.input`
	display: none;
`;

export function Upload(props: UploadProps) {
	const {
		action,
		headers,
		name,
		data,
		withCredentials,
		accept,
		multiple,
		beforeUpload,
		onSuccess,
		onProgress,
		onError,
		onChange,
		onRemove,
		drag,
		children,
	} = props;

	const fileInput = useRef<HTMLInputElement>(null);

	const [fileList, setFileList] = useState<Array<UploadFile>>([]);

	const updateFileList = (
		updateFile: UploadFile,
		updateObj: Partial<UploadFile>
	) => {
		setFileList((prevList) => {
			return prevList.map((file) => {
				if (file.uid === updateFile.uid) {
					return { ...file, ...updateObj };
				} else {
					return file;
				}
			});
		});
	};

	const handleClick = () => {
		if (fileInput.current) {
			fileInput.current.click();
		}
	};

	const handleRemove = (file: UploadFile) => {
		setFileList((prevState) => {
			return prevState.filter((item) => file.uid !== item.uid);
		});
		onRemove?.(file);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) {
			return;
		}
		uploadFile(files);
		if (fileInput.current) {
			fileInput.current.value = '';
		}
	};

	const uploadFile = (files: FileList) => {
		let postFiles = Array.from(files);
		postFiles.forEach((file) => {
			if (!beforeUpload) {
				post(file);
			} else {
				const result = beforeUpload(file);
				if (result && result instanceof Promise) {
					result.then((resFile) => {
						post(resFile);
					});
				} else if (result) {
					post(file);
				}
			}
		});
	};

	const post = (file: File) => {
		let uploadFile: UploadFile = {
			uid: Date.now() + 'upload-file',
			status: 'ready',
			name: file.name,
			size: file.size,
			percent: 0,
			raw: file,
		};
		setFileList((prevFile) => {
			return [uploadFile, ...prevFile];
		});
		const formData = new FormData();
		formData.append(name || 'file', file);
		if (data) {
			Object.keys(data).forEach((key) => {
				formData.append(key, data[key]);
			});
		}
		axios
			.post(action, formData, {
				headers: {
					...headers,
					'Content-Type': 'multipart/form-data',
				},
				withCredentials:withCredentials,
				onUploadProgress: (e: AxiosProgressEvent) => {
					let percentage =
						Math.round((e.loaded * 100) / e.total!) || 0;
					if (percentage < 100) {
						updateFileList(uploadFile, {
							percent: percentage,
							status: 'uploading',
						});
						onProgress?.(percentage, file);
					}
				},
			})
			.then((res) => {
				updateFileList(uploadFile, {
					status: 'success',
					response: res.data,
				});
				onSuccess?.(res.data, file);
			})
			.catch((err) => {
				updateFileList(uploadFile, {
					status: 'error',
					error: err,
				});
				onError?.(err, file);
			})
			.finally(() => {
				onChange?.(file);
			});
	};

	return (
		<UploadComponent>
			<UploadInput onClick={handleClick}>
				{drag ? (
					<Dragger onFile={(files) => uploadFile(files)}>
						{children}
					</Dragger>
				) : (
					children
				)}
				<UploadFileInput
					type="file"
					ref={fileInput}
					onChange={handleChange}
					accept={accept}
					multiple={multiple}
				/>
			</UploadInput>
			<UploadList fileList={fileList} onRemove={handleRemove} />
		</UploadComponent>
	);
}
