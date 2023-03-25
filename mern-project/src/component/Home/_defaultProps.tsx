import { AlertOutlined, CrownFilled, DownloadOutlined, ScanOutlined, TabletFilled } from '@ant-design/icons';
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
                        // component: './Welcome',
                        routes: [
                            {
                                path: 'init-new-product',
                                name: "Init Product",
                                icon: <CrownFilled />
                            },
                            {
                                path: 'amazon-products-list',
                                name: "Amazon Central",
                                icon: <CrownFilled />
                            },
                            {
                                path: 'amazon-surveillance',
                                name: "Amazon Surveillance",
                                icon: <CrownFilled />
                            }
                        ]
                    },
                    {
                        path: '/app/outbound',
                        name: 'Outbound',
                        icon: <CrownFilled />,
                        // component: './Welcome',
                        routes: [
                            {
                                path: 'needToShip',
                                name: "Shipping Central",
                                icon: <CrownFilled />
                            },
                            {
                                path: 'inventoryReceived',
                                name: "inventoryReceived",
                                icon: <CrownFilled />
                            },
                            {
                                path: 'searchRecord',
                                name: "Record Searching",
                                icon: <CrownFilled />
                            }
                        ]
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
            icon: <DownloadOutlined style={{ fontSize: "48px" }} />,
            title: 'Download',
            desc: 'download xlsx, csv, pdf',
            url: '',
        }
    ],
};