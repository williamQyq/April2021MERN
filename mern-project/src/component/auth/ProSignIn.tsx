import React from 'react';
import type { CSSProperties } from 'react';
import {
    LockOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    FcGoogle,
} from 'react-icons/fc';
import {
    AiFillApple,
} from 'react-icons/ai';
import {
    LoginFormPage,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import { Divider, message, Space, Tabs, Typography } from 'antd';
import { IProSignInProps, User, ReduxStateSignIn } from 'component/utility/cmpt.interface';
import WithNavigate from './WithNavigate';
import withToken from './WithToken';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { login, register, loadUser } from 'reducers/actions/authActions';
import { clearErrors } from 'reducers/actions/errorActions';
import { css } from '@emotion/css';

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};
interface IState {
    rootPath: string;
    loginType: LoginType;
}


class ProSignIn extends React.Component<IProSignInProps, IState>{
    constructor(props: IProSignInProps) {
        super(props);
        this.state = {
            rootPath: "/app",
            loginType: "account",
        }
    }


    componentDidUpdate(prevProps: Readonly<IProSignInProps>, prevState: Readonly<IState>, snapshot?: any): void {
        const { auth } = this.props;
        const { rootPath } = this.state;

        //check authenticated status if props.auth changed
        if (prevProps.auth !== auth) {
            if (auth.isAuthenticated) {
                this.props.clearErrors();
                this.props.navigate(rootPath, { replace: true });
            }
        }
    }

    //email & psw login
    handleLogin = async (user: User): Promise<void> => {
        return this.props.login(user);
    }

    //google oauth login
    handleGoogleOAuthLogin = () => {
        let timer: NodeJS.Timeout | null = null;
        const openOAuthWindow = (): Window | null => {
            const googleOAuthURL = "http://localhost:5000/api/auth/google";
            return window.open(googleOAuthURL, "_blank", "width=500,height=600");
        }
        const newWindow = openOAuthWindow();
        if (newWindow) {
            console.log(`opened new window`)
            timer = setInterval(() => {
                if (newWindow.closed) {

                    this.props.loadUser();
                    if (timer) clearInterval(timer);
                }
            }, 500);
        }
    }

    setLoginType = (type: LoginType) => {
        this.setState({ loginType: type });
    }

    render() {
        const { loginType, rootPath } = this.state;
        const isAuthenticated = this.props.auth.isAuthenticated;
        const { token } = this.props;
        return (
            isAuthenticated ? (
                <Navigate to={rootPath} replace={true} />
            ) : (
                <div className={css`
                    height: 100vh;
                    .ant-pro-form-login-page-container{
                        background: ${token.colorBgContainer};
                    }
                    .ant-pro-form-login-page-title{
                        color:${token.colorText}
                    }
                `}>
                    <LoginFormPage
                        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
                        logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                        title="Welcome to Rockystone"
                        submitter={{
                            searchConfig: {
                                submitText: 'Login'
                            },
                        }}
                        onFinish={(value) => this.handleLogin(value)}
                        // subTitle=""
                        // activityConfig={{
                        //     style: {
                        //         boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                        //         color: '#fff',
                        //         borderRadius: 8,
                        //         backgroundColor: '#1677FF',
                        //     },
                        //     title: '活动标题，可配置图片',
                        //     subTitle: '活动介绍说明文字',
                        //     action: (
                        //         <Button
                        //             size="large"
                        //             style={{
                        //                 borderRadius: 20,
                        //                 background: '#fff',
                        //                 color: '#1677FF',
                        //                 width: 120,
                        //             }}
                        //         >
                        //             去看看
                        //         </Button>
                        //     ),
                        // }}
                        actions={
                            < div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                }}
                            >
                                <Divider plain>
                                    <span style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}>
                                        OAUTH
                                    </span>
                                </Divider>
                                <Space align="center" size={24}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            height: 40,
                                            width: 160,
                                            border: '2px solid #D4D8DD',
                                            borderRadius: '4px',
                                            cursor: "pointer"
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.handleGoogleOAuthLogin()
                                        }}
                                    >
                                        <FcGoogle style={{ ...iconStyles }} />
                                        <Typography.Text>Sign In with Google</Typography.Text>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            height: 40,
                                            width: 160,
                                            border: '2px solid #D4D8DD',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        <AiFillApple style={{ ...iconStyles, color: `${token.colorText}` }} />
                                        <Typography.Text>Sign In with Apple</Typography.Text>
                                    </div>
                                </Space>
                            </div>
                        }
                    >
                        <Tabs
                            centered
                            activeKey={loginType}
                            onChange={(activeKey) => this.setLoginType(activeKey as LoginType)}
                            items={[
                                { key: "account", label: "EMAIL" },
                                { key: "phone", label: "PHONE NUMBER" }
                            ]}
                        >

                        </Tabs>
                        {
                            loginType === 'account' && (
                                <>
                                    <ProFormText
                                        name="username"
                                        fieldProps={{
                                            size: 'large',
                                            prefix: <UserOutlined className={'prefixIcon'} />,
                                        }}
                                        placeholder={''}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'EMAIL',
                                            },
                                        ]}
                                    />
                                    <ProFormText.Password
                                        name="password"
                                        fieldProps={{
                                            size: 'large',
                                            prefix: <LockOutlined className={'prefixIcon'} />,
                                        }}
                                        placeholder={''}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'PASSWORD',
                                            },
                                        ]}
                                    />
                                </>
                            )
                        }
                        {
                            loginType === 'phone' && (
                                <>
                                    <ProFormText
                                        fieldProps={{
                                            size: 'large',
                                            prefix: <MobileOutlined className={'prefixIcon'} />,
                                        }}
                                        name="mobile"
                                        placeholder={'PHONE NUMBER'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'PHONE NUMBER！',
                                            },
                                            {
                                                pattern: /^1\d{10}$/,
                                                message: 'WRONG FORMAT！',
                                            },
                                        ]}
                                    />
                                    <ProFormCaptcha
                                        fieldProps={{
                                            size: 'large',
                                            prefix: <LockOutlined className={'prefixIcon'} />,
                                        }}
                                        captchaProps={{
                                            size: 'large',
                                        }}
                                        placeholder={'verification code'}
                                        captchaTextRender={(timing, count) => {
                                            if (timing) {
                                                return `${count} ${'Get Verification Code'}`;
                                            }
                                            return 'Get Verification Code';
                                        }}
                                        name="captcha"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Verification Code！',
                                            },
                                        ]}
                                        onGetCaptcha={async () => {
                                            message.success('Success！code：1234');
                                        }}
                                    />
                                </>
                            )
                        }
                        <div
                            style={{
                                marginBlockEnd: 24,
                            }}
                        >
                            <ProFormCheckbox noStyle name="autoLogin">
                                Keep me logged in
                            </ProFormCheckbox>
                            <a
                                style={{
                                    float: 'right',
                                }}
                            >
                                Forgot Password
                            </a>
                        </div>
                    </LoginFormPage >
                </div >
            )
        );
    }
};

const mapStateToProps = (state: ReduxStateSignIn) => ({
    auth: state.auth,
    error: state.error
});

export default withToken(
    WithNavigate(
        connect(
            mapStateToProps,
            {
                login,
                register,
                clearErrors,
                loadUser
            }
        )(ProSignIn)
    ));