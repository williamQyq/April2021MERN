import React from 'react';
import 'styles/Operation.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { defaultSettings } from 'component/Operation/_Settings';
import { mainColumns } from 'component/Operation/SkuManagement/OperationEditableEle.jsx';
import { getProductPricing } from 'reducers/actions/operationActions.js';
import OperationMenu from 'component/Operation/SkuManagement/OperationMenu.jsx';
import { SocketContext } from 'component/socket/socketContext';
// import BackTopHelper from 'component/utility/BackTop.jsx';
import FormTable from 'component/utility/FormTable';
import { ContentHeader, SubContentHeader } from 'component/utility/Layout';

class OperationProductList extends React.Component {
    static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
            editingKey: '',
            data: [],
            defaultSettings: defaultSettings
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        let socket = this.context
        socket.emit(`subscribe`, `OperationRoom`);
        this.props.getProductPricing()
        socket.on(`Prod Pricing Update`, () => {
            this.props.getProductPricing();
        })
    }
    componentDidUpdate(prevProps, nextProps) {
        const dataSource = this.props.sellingPartner
        if (prevProps !== this.props && dataSource.length > 0) {    //amazon redux state updated, copy redux state to component state for ease use of local state editing(editable cell)
            this.setState({ data: dataSource })
        }
    }
    componentWillUnmount() {
        let socket = this.context
        socket.emit(`unsubscribe`, `OperationRoom`)
    }

    isLoading = () => {
        const { loading } = this.props;
        return loading;
    }
    isEditing = (record) => record._id === this.state.editingKey

    edit = (record) => {
        this.formRef.current.setFieldsValue({
            ...record
        })
        this.setState({
            editingKey: record._id
        })
    }
    cancel = () => {
        this.setState({
            editingKey: ""
        })
    }
    save = async (key) => {
        try {
            const row = await this.formRef.current.validateFields();
            const newData = [...this.props.sellingPartner];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                this.setState({ data: newData });
                this.setState({ editingKey: "" });
            } else {
                newData.push(row);
                this.setState({ newData });
                this.setState({ editingKey: "" });
            }
        } catch (err) {
            console.log("Validate Failed:", err);
        }
    }

    publish = (record) => {
        //publish record to amazon seller central...

    }

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };



    render() {
        const { data, defaultSettings } = this.state;
        const { loading } = this.props;
        const actions = {
            isEditing: this.isEditing,
            edit: this.edit,
            cancel: this.cancel,
            save: this.save,
            publish: this.publish,
            editingKey: this.state.editingKey,
            handleSearch: this.handleSearch,
            handleReset: this.handleReset
        }
        const columns = mainColumns(actions)
        return (
            <>
                <ContentHeader title="All Listed Products" />
                <OperationMenu {...this.state} />
                <Form ref={this.formRef} component={false}>
                    <FormTable
                        loading={loading}
                        tableSettings={defaultSettings}
                        columns={columns}
                        data={data}
                    />
                </Form>
                <SubContentHeader title="New Products" />

                {/* <BackTopHelper /> */}
            </>

        );
    }
}

OperationProductList.prototypes = {
    getProductPricing: PropTypes.func.isRequired,
    sellingPartner: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
}
const mapStateToProps = (state) => ({
    sellingPartner: state.amazon.sellingPartner,
    loading: state.amazon.loading,
})

export default connect(mapStateToProps, { getProductPricing })(OperationProductList);