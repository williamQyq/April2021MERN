import {
    GithubFilled,
    InfoCircleFilled,
    QuestionCircleFilled,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
    ProCard,
    PageContainer,
    ProConfigProvider,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import React from 'react';
import defaultProps from './_defaultProps';
import { connect } from 'react-redux';
import WithNavigate from 'component/auth/WithNavigate';
import MenuCard from 'component/Home/MenuCard';
import SearchInput from 'component/Home/Search';
import HomeContent from 'component/Home/HomeContent.jsx';
import { loadUser, logout } from 'reducers/actions/authActions';
import { Avatar, Button } from 'antd';
import { Location, NavigateFunction } from 'react-router-dom';

interface IProHomeProps {
    navigate: NavigateFunction,
    location: Location,
    logout: () => void;

};

interface IState {
    settings: Partial<ProSettings | undefined>;
    pathname: string
}


class ProHome extends React.Component<IProHomeProps, IState>{

    constructor(props: IProHomeProps) {
        super(props)
        this.state = {
            settings: {
                fixSiderbar: true,
                layout: 'mix',
                splitMenus: true,
                navTheme: "realDark",
                contentWidth: "Fluid",
                colorPrimary: "#1890ff",
                siderMenuType: "sub"
            },
            pathname: "/app/operation"
        }
    }
    setPathname = (pathname: string) => {
        this.setState({ pathname });
    }
    setSetting = (changeSettings: Partial<ProSettings>) => {
        this.setState({ settings: changeSettings })
    }

    navigateTo = (pathname: string | undefined) => {
        this.props.navigate(pathname || '/app/operation');
        this.setPathname(pathname || '/app/operation');
    }

    render() {
        const { pathname, settings } = this.state;
        const { navigate, logout } = this.props;

        return (
            <div
                id="test-pro-layout"
                style={{
                    height: '100vh',
                }}
            >
                <ProConfigProvider hashed={false}>
                    <ProLayout
                        logo={
                            <Avatar src="https://images-rocky-public.s3.amazonaws.com/logo.jpg" />
                        }
                        title="Morty Citadel"
                        bgLayoutImgList={[
                            {
                                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                                left: 85,
                                bottom: 100,
                                height: '303px',
                            },
                            {
                                src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                                bottom: -68,
                                right: -45,
                                height: '303px',
                            },
                            {
                                src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                                bottom: 0,
                                left: 0,
                                width: '331px',
                            },
                        ]}
                        {...defaultProps}
                        location={{
                            pathname,
                        }}
                        siderMenuType="group"
                        menu={{
                            collapsedShowGroupTitle: true,
                        }}
                        avatarProps={{
                            src: 'https://images-rocky-public.s3.amazonaws.com/kisspng-rick-sanchez-morty-srick.jpg',
                            size: 'default',
                            title: 'Poppy Butthole',
                            // onClick(e) {
                            //     e?.preventDefault();
                            // },
                        }}
                        actionsRender={(props) => {
                            if (props.isMobile) return [];
                            return [
                                props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                                    <SearchInput />
                                ) : undefined,
                                <InfoCircleFilled key="InfoCircleFilled" />,
                                <QuestionCircleFilled key="QuestionCircleFilled" />,
                                <GithubFilled key="GithubFilled" />,
                            ];
                        }}
                        headerTitleRender={(logo, title, _) => {
                            const defaultDom = (
                                <a>
                                    {logo}
                                    {title}
                                </a>
                            );
                            if (document.body.clientWidth < 1400) {
                                return defaultDom;
                            }
                            if (_.isMobile) return defaultDom;
                            return (
                                <>
                                    {defaultDom}
                                    <MenuCard />
                                </>
                            );
                        }}
                        menuFooterRender={(props) => {
                            if (props?.collapsed) return undefined;
                            return (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        paddingBlockStart: 12,
                                    }}
                                >
                                    <div>© 2022 by w citadel</div>
                                </div>
                            );
                        }}
                        onMenuHeaderClick={(e) => console.log(e)}
                        menuItemRender={(item, dom) => {
                            return (
                                <div onClick={() => this.navigateTo(item.path)}>
                                    {dom}
                                </div>

                            )
                        }}
                        {...settings}
                    >
                        <PageContainer
                            footer={[
                                <Button
                                    key="1"
                                    type="primary"
                                    danger
                                    onClick={() => logout()}
                                >Log Out</Button>,
                            ]}
                        >
                            <ProCard
                                style={{
                                    height: '200vh',
                                    minHeight: 800,
                                }}
                            >
                                <HomeContent />
                            </ProCard>
                        </PageContainer>

                        <SettingDrawer
                            pathname={pathname}
                            enableDarkTheme
                            getContainer={() => document.getElementById('test-pro-layout')}
                            settings={settings}
                            onSettingChange={(changeSetting) => {
                                this.setSetting(changeSetting);
                            }}
                            disableUrlParams={false}
                        />
                    </ProLayout>
                </ProConfigProvider>
            </div>
        );
    }
}

export default WithNavigate(connect(null, { logout, loadUser })(ProHome));