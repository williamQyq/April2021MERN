import React from 'react';
import { Layout, Form, Input, Button, Typography, message } from 'antd';
import 'styles/login.scss';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, register } from 'reducers/actions/authActions.js';
import { clearErrors } from 'reducers/actions/errorActions.js';
import WithNavigate from './WithNavigate.js';
import { Navigate } from 'react-router-dom';

const { Sider, Content, } = Layout;
const { Text, Title, Link } = Typography;

message.config({
    maxCount: 3,
})

const siderLayout = {
    width: "50%",
    collapsible: true,
    breakpoint: "lg",
    collapsedWidth: "0",
    trigger: null
    // zeroWidthTriggerStyle: {}
}

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

class SignIn extends React.Component {

    state = {
        email: "",
        password: "",
        msg: null
    }
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        isLoading: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidMount() {
        // const { isAuthenticated } = this.props;
        // if (isAuthenticated) {
        //     this.props.navigate('/app', { replace: true });
        // }
    }
    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg.msg });
                message.error(`Sign in failed, ${error.msg.msg}`)
            } else {
                this.setState({ msg: null });
            }
        }
        if (isAuthenticated) {
            message.success('Sign in success!');
            this.props.clearErrors();
            this.props.navigate('/app', { replace: true });
        }

    }

    onFinish = (values) => {
        const { email, password } = values;
        const user = {
            email,
            password
        }
        this.props.login(user);


    }
    onFinishFailed = (errorInfo) => {
        message.error("Sign in failed!")
    }

    normalize = (value) => {
        return value.replace(/^\s+|\s+$/g, "")
    }

    handleAccountRegister = () => {
        console.log('User request registration')
        this.props.register();
    }

    render() {
        const { isAuthenticated } = this.props;
        return (
            isAuthenticated ?
                <Navigate to="/app" replace={true} />
                :
                <Layout className="login-layout" style={{ minHeight: "100vh" }}>
                    <Sider id='image-sider' {...siderLayout} />
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
                                name="email"
                                label="Email or Username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email or Username is required.'
                                    },
                                ]}
                                normalize={this.normalize}
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
                                <Link onClick={() => this.handleAccountRegister()}>Create an account</Link>
                            </Form.Item>


                        </Form>
                    </Content>
                </Layout>
        );
    }

}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    error: state.error
})
export default WithNavigate(connect(mapStateToProps, { login, clearErrors, register })(SignIn));