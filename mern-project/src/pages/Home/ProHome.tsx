import React from 'react';
import { connect } from 'react-redux';
import { Location, NavigateFunction } from 'react-router-dom';
import { CgSun, CgMoon } from 'react-icons/cg';
import { Avatar, Button, Switch } from 'antd';
import {
    ProCard,
    PageContainer,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import { ThemeContext } from './components/ThemeProvider';
import defaultProps from './components/_defaultProps';
import WithNavigate from '@src/component/auth/WithNavigate';
import MenuCard from '@view/Home/components/MenuCard';
import SearchInput from '@view/Home/components/Search';
import HomeContent from '@view/Home/components/HomeContent';
import { loadUser, logout } from '@redux-action/authActions';

interface IProHomeProps {
    location: Location;
    navigate: NavigateFunction;
    logout: () => void;
    loadUser: () => void;
};

interface IState {
    pathname: string;
}

class ProHome extends React.Component<IProHomeProps, IState>{
    static contextType = ThemeContext;
    declare context: React.ContextType<typeof ThemeContext>;

    constructor(props: IProHomeProps) {
        super(props);
        this.state = {
            pathname: "/app/operation",
        }
    }
    componentDidMount(): void {
        // this.props.loadUser();
    }

    setPathname = (pathname: string) => {
        this.setState({ pathname });
    }

    navigateTo = (pathname: string | undefined) => {
        this.props.navigate(pathname || '/app/operation');  //default navigate to operation menu
        this.setPathname(pathname || '/app/operation');
    }

    render() {
        const { pathname } = this.state;
        const { logout } = this.props;
        const settings = this.context!.themeSettings;
        const toggleTheme = this.context!.toggleTheme;

        return (
            <div
                id="test-pro-layout"
                style={{
                    height: '100vh',
                }}
            >
                <ProLayout
                    logo={
                        <Avatar src="https://images-rocky-public.s3.amazonaws.com/logo.jpg" />
                    }
                    title="w Citadel"
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
                        title: 'Poppy Rick',
                        // onClick(e) {
                        //     e?.preventDefault();
                        // },
                    }}
                    actionsRender={(props: { isMobile: any; layout: string; }) => {
                        if (props.isMobile) return [];
                        return [
                            props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                                <SearchInput />
                            ) : undefined,
                            <Switch
                                checkedChildren={<CgMoon />}
                                unCheckedChildren={<CgSun />}
                                onChange={toggleTheme}
                            />
                        ];
                    }}
                    headerTitleRender={(logo: React.ReactElement, title: string, _: { isMobile: boolean; }) => {
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
                    menuFooterRender={(props: { collapsed: any; }) => {
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
                    onMenuHeaderClick={(e: any) => console.log(e)}
                    menuItemRender={(item: { path: string | undefined; }, dom: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => {
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
                            this.context?.setThemeSetting(changeSetting)
                        }}
                        disableUrlParams={false}
                    />
                </ProLayout>
            </div>
        );
    }
}

export default WithNavigate(connect(null, { logout, loadUser })(ProHome));