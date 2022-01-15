import 'antd/dist/antd.css';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const props = {
    name: 'file',
    multiple: true,
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
        const text = await file.text();
        console.log(`file====${JSON.stringify(text, null, 4)}`)
        setTimeout(() => {
            onSuccess("ok")
            onError("yes")
        }, 2000)
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

const FileUpload = () => {

    return (
        <div style={{ height: '150px' }}>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>
        </div>
    )
}

export default FileUpload;