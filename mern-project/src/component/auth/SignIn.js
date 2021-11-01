import React from 'react';
import { Layout, Image, Form, Input, Button, Typography, message } from 'antd';
import 'antd/dist/antd.css';
import 'styles/login.scss';
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import mainImage from "styles/assets/imageLogin.jpg";
import { withRouter } from 'react-router-dom';


const { Sider, Content, } = Layout;
const { Text, Title } = Typography;

message.config({
    maxCount: 3,
})

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    onFinish = (values) => {
        message.success('Sign in success!');
        this.props.history.push('/home');
    }
    onFinishFailed = (errorInfo) => {
        message.error("Sign in failed!")
    }

    render() {
        const siderLayout = {
            width: "50%"
        }
        // const imageProps = {
        //     preview: false,
        //     src: mainImage,
        //     height:"100%",
        // }

        const formLayout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 14
            },
            layout: "vertical",
            initialValues: {
                remember: true
            }
        }

        return (
            <Layout className="login-layout">
                <Sider {...siderLayout}>
                    {/* <Image  {...imageProps}></Image> */}
                </Sider>
                <Content className="login-content">
                    <Form
                        className="login-form"
                        {...formLayout}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item>
                            <Title level={3}>Welcome to RockyStone</Title>
                        </Form.Item>
                        <Form.Item
                            name="user"
                            label="Email or Username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email or Username is required.'
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Password is required"
                                },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Button className="sign-in-btn" type="primary" htmlType="submit">Sign In</Button>
                            <Text>Not on RockyStone?</Text>
                            <Link>Create an account</Link>
                        </Form.Item>


                    </Form>
                </Content>
            </Layout>


        );
    }

}

export default withRouter(SignIn)