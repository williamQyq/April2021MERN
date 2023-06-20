import React from 'react';
import { connect } from 'react-redux';
// import { getCCItems } from '../../@redux-action//itemCCActions';
import PropTypes from 'prop-types';
import { Table, Input, Button, Space, Typography, Row, Menu, Dropdown } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, PlusCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import StoreTable from './StoreTable.jsx';
import { STORE } from './data.js';

const { Title } = Typography;

class CC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            store: STORE.COSTCO
        };

    }

    componentDidMount() {
        // this.props.getCCItems();
    }

    render() {
        return (
            <StoreTable />

        )
    }
}

CC.prototypes = {

}

const mapStateToProps = (state) => ({
})

// export default connect(mapStateToProps, { getCCItems })(CC);
export default CC;