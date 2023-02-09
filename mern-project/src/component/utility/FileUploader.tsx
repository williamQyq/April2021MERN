import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'reducers/store/store';
import { FileUploadRequestOption, FileUploadProps } from './cmpt.interface';
const { Dragger } = Upload;

interface IProps {
    customizedUpload: (options: FileUploadRequestOption) => void;
}

const FileUploader: React.FC<IProps> = ({ customizedUpload }) => {
    const dispatch: AppDispatch = useDispatch()

    const draggerProps: FileUploadProps = {
        name: 'file',
        multiple: true,
        accept: ".txt, .csv",
        onChange(info) {
            const { status, response, error } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} upload successful.\n${response}`);
            } else if (status === 'error') {
                message.error(`${info.file.name} upload failed.\n${error}`);
            }
        },
        customRequest: ({ file, onSuccess, onError }) => {
            dispatch(customizedUpload({ file, onSuccess, onError }))
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload(file, fileList) {
            fileList = []
            // if file not csv, return false
        }
    };

    return (
        <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text" >Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
            </p>
        </Dragger>
    )
}

export default FileUploader;