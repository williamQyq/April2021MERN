import React from 'react';
import { HiTemplate, HiDownload } from 'react-icons/hi';

interface IProps {
    handleTemplateDownload: () => any;
}
const TemplateDownloader: React.FC<IProps> = (props) => {
    const { handleTemplateDownload } = props;

    return (
        <div style={{ "cursor": "pointer" }} onClick={handleTemplateDownload}>
            <HiTemplate />
            <HiDownload />
        </div>
    );
}
export default TemplateDownloader;