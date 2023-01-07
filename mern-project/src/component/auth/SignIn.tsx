import React, { CSSProperties } from 'react';
import { Layout, Form, Input, Button, Typography, message, SiderProps } from 'antd';
// import 'styles/login.scss';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, register } from 'reducers/actions/authActions.js';
import { clearErrors } from 'reducers/actions/errorActions.js';
import WithNavigate from './WithNavigate.js';
import { Navigate, NavigateFunction } from 'react-router-dom';
import { FormProps } from 'antd/es/form/Form.js';
import background from 'styles/assets/background.png';

const { Sider, Content, } = Layout;
const { Text, Title, Link } = Typography;

message.config({
    maxCount: 3,
})

const siderLayout: Partial<SiderProps> = {
    width: "50VW",
    style: {
        maxWidth: "50 vw",
        backgroundImage: `url(${background})`,
        backgroundPosition: "right top",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    },
    collapsible: true,
    breakpoint: "lg",
    collapsedWidth: "0",
    trigger: null
    // zeroWidthTriggerStyle: {}
}

const formLayout: Partial<FormProps> = {
    style: {
        maxHeight: "100vh",
        maxWidth: "100vw",
        margin: "auto 52px"
    },
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

const contentLayout: CSSProperties = {
    minHeight: "25vh",
    minWidth: "600px",
    margin: "auto",
    whiteSpace: "nowrap"
}

interface IProps extends ReduxStateSignIn {
    isAuthenticated: boolean;
    navigate: NavigateFunction;
    register: () => void;
    login: (user: IUser) => void;
    clearErrors: () => void;
}

interface IState {

}

interface IUser {
    email: string;
    password: string;
}

interface IErrorResp {
    msg: string;
}

interface ReduxStateSignIn {
    auth: {
        isAuthenticated: boolean;
        isLoading: boolean;
    }
    error: {
        msg: IErrorResp;
        status: unknown;
        id: unknown;
        reason: unknown;
    }
}

class SignIn extends React.Component<IProps, IState> {

    state = {
        email: "",
        password: "",
        msg: null
    }
    // static propTypes = {
    //     isAuthenticated: PropTypes.bool,
    //     isLoading: PropTypes.bool,
    //     error: PropTypes.object.isRequired,
    //     login: PropTypes.func.isRequired,
    //     clearErrors: PropTypes.func.isRequired
    // }

    componentDidMount() {
        // const { isAuthenticated } = this.props;
        // if (isAuthenticated) {
        //     this.props.navigate('/app', { replace: true });
        // }
    }
    componentDidUpdate(prevProps: IProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg.msg });
                // message.error(`Sign in failed, ${error.msg.msg}`)
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

    onFinish = (values: IUser) => {
        const { email, password } = values;
        const user: IUser = {
            email,
            password
        }
        this.props.login(user);


    }
    onFinishFailed = (errorInfo: unknown) => {
        message.error("Sign in failed!")
    }

    normalize = (value: string) => {
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
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider {...siderLayout} />
                    <Content style={contentLayout}>
                        <Form
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
                                <Input width={"700px"} prefix={<UserOutlined />} />
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
                                <Input.Password width={"700px"} prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ marginRight: "24px" }}
                                >
                                    Sign In
                                </Button>
                                <Text>Not on RockyStone? </Text>
                                <Link onClick={() => this.handleAccountRegister()}>Create an account</Link>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
        );
    }

}
const mapStateToProps = (state: ReduxStateSignIn) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    error: state.error
})
export default WithNavigate(connect(mapStateToProps, { login, clearErrors, register })(SignIn));