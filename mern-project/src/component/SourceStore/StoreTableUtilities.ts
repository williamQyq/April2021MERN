import {
    Menu,
    Button,
    Typography,
    Tooltip,
    Dropdown,
    message,
    Input,
    Tree,
} from "antd";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    DownOutlined,
    PlusCircleOutlined,
    WindowsOutlined,
    ImportOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addItemSpec, getItemsOnlinePrice } from "reducers/actions/itemActions.js";
import { setTableState } from "reducers/actions/itemActions.js";
import { useCallback, useState } from "react";

import './Store.scss';

const { Text } = Typography;
const { Search } = Input;

const TypoLink = Typography.Link;
const globalMsgConfig = {
    maxCount: 3
}
message.config = (globalMsgConfig) => { }










