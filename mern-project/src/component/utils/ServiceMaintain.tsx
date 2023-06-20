import React from 'react';
import { Button, Result } from "antd";
import { IoIosConstruct } from 'react-icons/io';
import { AiOutlineRollback } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';


const ServiceMaintain: React.FC = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div style={{ "marginTop": "20vh" }}>
            <Result
                icon={<IoIosConstruct fontSize={"800%"}/>}
                title="New Service Coming Soon"
                extra={
                    <Button
                        style={{width:"180px"}}
                        type="primary"
                        icon={
                            <AiOutlineRollback />
                        }
                        onClick={goBack}
                    />
                }
            />
        </div>
    );
}

export default ServiceMaintain;