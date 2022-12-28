import { AlertOutlined, ChromeFilled, CrownFilled, DownloadOutlined, ScanOutlined, SmileFilled, TabletFilled } from '@ant-design/icons';
import React from 'react';
import { AiOutlineShopping } from 'react-icons/ai';
import { GrAmazon } from 'react-icons/gr';

export default {
    route: {
        path: '/',
        routes: [
            {
                path: '/admin',
                name: 'Admin',
                icon: <CrownFilled />,
                access: 'canAdmin',
                component: './Admin',
                routes: [
                    // {
                    //     path: '/admin/sub-page1',
                    //     name: 'sub-page1',
                    //     icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
                    //     component: './Welcome',
                    // },
                ],
            },
            {
                name: 'Panel Station',
                icon: <TabletFilled />,
                path: '/app',
                component: './ListTableList',
                routes: [
                    {
                        path: '/app/deal-alert',
                        name: 'Deal Alert',
                        icon: <AlertOutlined />,
                        // routes: [
                        //     {
                        //         path: 'sub-sub-page1',
                        //         name: '一一级列表页面',
                        //         icon: <CrownFilled />,
                        //         component: './Welcome',
                        //     },
                        //     {
                        //         path: 'sub-sub-page2',
                        //         name: '一二级列表页面',
                        //         icon: <CrownFilled />,
                        //         component: './Welcome',
                        //     },
                        //     {
                        //         path: 'sub-sub-page3',
                        //         name: '一三级列表页面',
                        //         icon: <CrownFilled />,
                        //         component: './Welcome',
                        //     },
                        // ],
                    },
                    {
                        path: '/app/operation',
                        name: 'Operation',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                    {
                        path: '/app/outbound',
                        name: 'Outbound',
                        icon: <CrownFilled />,
                        component: './Welcome',
                    },
                ],
            },

        ],
    },
    location: {
        pathname: '/',
    },
    appList: [
        {
            icon: <AiOutlineShopping style={{ fontSize: "48px" }} />,
            title: 'Deal Alert',
            desc: 'Price Deal Realtime Alert',
            url: '',
        },
        {
            icon: <GrAmazon style={{ fontSize: "48px" }} />,
            title: 'Amazon Selling Partner',
            desc: 'Amz Resource Management',
            url: 'https://antv.vision/',
            target: '_blank',
        },
        {
            icon: <ScanOutlined style={{ fontSize: "48px" }} />,
            title: 'Pro Components',
            desc: 'Part Scan',
            url: '',
        },
        {
            icon: <DownloadOutlined style={{ fontSize: "48px" }}/>,
            title: 'Download',
            desc: 'download xlsx, csv, pdf',
            url: '',
        }
    ],
};