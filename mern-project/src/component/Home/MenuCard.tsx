import React from 'react';
import { Popover, Divider, theme } from 'antd';
import {
    CaretDownFilled,
    DoubleRightOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/css';


const Item: React.FC<{ children: React.ReactNode }> = (props) => {
    const { token } = theme.useToken();
    return (
        <div
            className={css`
          color: ${token.colorTextSecondary};
          font-size: 14px;
          cursor: pointer;
          line-height: 22px;
          margin-bottom: 8px;
          &:hover {
            color: ${token.colorPrimary};
          }
        `}
            style={{
                width: '33.33%',
            }}
        >
            {props.children}
            <DoubleRightOutlined
                style={{
                    marginInlineStart: 4,
                }}
            />
        </div>
    );
};


const List: React.FC<{ title: string; style?: React.CSSProperties }> = (props) => {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                width: '100%',
                ...props.style,
            }}
        >
            <div
                style={{
                    fontSize: 16,
                    color: token.colorTextHeading,
                    lineHeight: '24px',
                    fontWeight: 500,
                    marginBlockEnd: 16,
                }}
            >
                {props.title}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {new Array(3).fill(1).map((_, index) => {
                    return <Item key={index}>Coming out-{index}</Item>;
                })}
            </div>
        </div>
    );
};

const MenuCard: React.FC = () => {
    const { token } = theme.useToken();
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Divider
                style={{
                    height: '1.5em',
                }}
                type="vertical"
            />
            <Popover
                placement="bottom"
                overlayStyle={{
                    width: 'calc(100vw - 24px)',
                    padding: '24px',
                    paddingTop: 8,
                    height: '307px',
                    borderRadius: '0 0 6px 6px',
                }}
                content={
                    <div style={{ display: 'flex', padding: '32px 40px' }}>
                        <div style={{ flex: 1 }}>
                            <List title="Solution I" />
                            <List
                                title="Solution II"
                                style={{
                                    marginBlockStart: 32,
                                }}
                            />
                        </div>

                        <div
                            style={{
                                width: '308px',
                                borderInlineStart: '1px solid ' + token.colorBorder,
                                paddingInlineStart: 16,
                            }}
                        >
                            <div
                                className={css`
                    font-size: 14px;
                    color: ${token.colorText};
                    line-height: 22px;
                  `}
                            >
                                Quick Portal
                            </div>
                            {new Array(3).fill(1).map((name, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={css`
                        border-radius: 4px;
                        padding: 16px;
                        margin-top: 4px;
                        display: flex;
                        cursor: pointer;
                        &:hover {
                          background-color: ${token.colorBgTextHover};
                        }
                      `}
                                    >
                                        <img src="https://gw.alipayobjects.com/zos/antfincdn/6FTGmLLmN/bianzu%25252013.svg" />
                                        <div
                                            style={{
                                                marginInlineStart: 14,
                                            }}
                                        >
                                            <div
                                                className={css`
                            font-size: 14px;
                            color: ${token.colorText};
                            line-height: 22px;
                          `}
                                            >
                                                Portal
                                            </div>
                                            <div
                                                className={css`
                            font-size: 12px;
                            color: ${token.colorTextSecondary};
                            line-height: 20px;
                          `}
                                            >
                                                dimensions
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }
            >
                <div
                    style={{
                        color: token.colorTextHeading,
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 4,
                        paddingInlineStart: 8,
                        paddingInlineEnd: 12,
                        alignItems: 'center',
                    }}
                    className={css`
              &:hover {
                background-color: ${token.colorBgTextHover};
              }
            `}
                >
                    <span> Data Panel Portal</span>
                    <CaretDownFilled />
                </div>
            </Popover>
        </div>
    );
};

export default MenuCard;