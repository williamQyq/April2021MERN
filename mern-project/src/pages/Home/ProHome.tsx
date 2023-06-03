import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
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
import { RootState } from '@src/redux/store/store';

interface IProHomeProps extends PropsFromRedux {
    location: Location;
    navigate: NavigateFunction;
};

interface IState {
    pathname: string;
}

class ProHome extends React.Component<IProHomeProps, IState>{
    static contextType = ThemeContext;
    declare context: React.ContextType<typeof ThemeContext>;
    abortController?: AbortController;

    constructor(props: IProHomeProps) {
        super(props);
        this.state = {
            pathname: "/app/operation",
        }
    }
    componentDidMount(): void {
        this.abortController = new AbortController();
        this.props.loadUser(this.abortController.signal);
    }
    componentDidUpdate(prevProps: Readonly<IProHomeProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.error !== this.props.error) {
            if (this.props.error.status === 401) {
                this.props.loadUser(this.abortController?.signal);
            }
        }
    }
    componentWillUnmount(): void {
        this.abortController?.abort();
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
        const { logout, auth } = this.props;
        const settings = this.context!.themeSettings;
        const toggleTheme = this.context!.toggleTheme;
        const name = auth.user?.name ? auth.user.name : "Bro?";
        const photo = auth.user?.photo ? auth.user.photo : "https://images-rocky-public.s3.amazonaws.com/kisspng-rick-sanchez-morty-srick.jpg";

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
                    title="Wiggle Citadel"
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
                        src: photo,
                        size: 'default',
                        title: `Hi ${name}!`,
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

const mapStateToProps = (state: RootState) => ({
    auth: state.auth,
    error: state.error
})

const connector = connect(mapStateToProps, { logout, loadUser });
type PropsFromRedux = ConnectedProps<typeof connector>;

export default WithNavigate(connector(ProHome));