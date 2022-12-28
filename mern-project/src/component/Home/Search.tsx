import React from 'react';
import {
    BiSearchAlt
} from 'react-icons/bi';
import {
    SearchOutlined,
} from '@ant-design/icons';
import { Input, theme } from 'antd';



const SearchInput: React.FC = () => {
    const { token } = theme.useToken();
    return (
        <div
            key="SearchOutlined"
            aria-hidden
            style={{
                display: 'flex',
                alignItems: 'center',
                marginInlineEnd: 24,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <Input
                style={{
                    borderRadius: 4,
                    marginInlineEnd: 12,
                    backgroundColor: token.colorBgTextHover,
                }}
                prefix={
                    <SearchOutlined
                        style={{
                            color: token.colorTextLightSolid,
                        }}
                    />
                }
                placeholder="searching"
                bordered={false}
            />
            <BiSearchAlt
                style={{
                    color: token.colorPrimary,
                    fontSize: 24,
                }}
            />
        </div>
    );
};

export default SearchInput;