import {
    GithubFilled,
    InfoCircleFilled,
    QuestionCircleFilled,
    TrademarkCircleOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
    ProCard,
    PageContainer,
    ProConfigProvider,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import React, { useState } from 'react';
import defaultProps from './_defaultProps';
import MenuCard from 'component/Home/MenuCard';
import SearchInput from 'component/Home/Search';
import HomeContent from 'component/Home/HomeContent.jsx';
import { useNavigate } from 'react-router-dom';

const ProHome: React.FC = () => {
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
        layout: 'mix',
        splitMenus: true,
    });

    const navigate = useNavigate();

    const [pathname, setPathname] = useState('/list/sub-page2');
    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProConfigProvider hashed={false}>
                <ProLayout
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
                        title: 'Rick Sanchez',
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
                                <div>© 2022 by w</div>
                            </div>
                        );
                    }}
                    onMenuHeaderClick={(e) => console.log(e)}
                    menuItemRender={(item, dom) => {
                        return (
                            <div
                                onClick={() => {
                                    navigate(item.path||'/app/operation');
                                    setPathname(item.path || '/welcome');
                                }}
                            >
                                {dom}
                            </div>

                        )
                    }}
                    {...settings}
                >
                    <PageContainer
                        subTitle="sub desc"
                        footer={[
                            // <Button key="3">重置</Button>,
                            // <Button key="2" type="primary">
                            //     提交
                            // </Button>,
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
                            setSetting(changeSetting);
                        }}
                        disableUrlParams={false}
                    />
                </ProLayout>
            </ProConfigProvider>
        </div>
    );
};

export default ProHome;