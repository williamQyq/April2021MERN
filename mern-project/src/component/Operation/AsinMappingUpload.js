import 'antd/dist/antd.css';
import 'component/Operation/operation.scss';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadAsinsMapping } from 'reducers/actions/amazonActions';
import { connect } from 'react-redux';

const { Dragger } = Upload;


const FileUpload = (props) => {

    const draggerProps = {
        name: 'file',
        multiple: true,
        action: null,
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
            props.uploadAsinsMapping(text)
                .then(res => {
                    if (res.data == 'success') {
                        onSuccess()
                    } else {
                        onError()
                    }
                })
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload(file) {
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

const mapStateToProps = {

}

export default connect(null, { uploadAsinsMapping })(FileUpload);