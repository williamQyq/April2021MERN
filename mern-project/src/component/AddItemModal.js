import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Input } from 'antd';
import {
    PlusSquareOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { addItem } from '../reducers/actions/itemActions';

const AddItemModal = (props) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [input, setInput] = useState(null);

    const getInput = (e) => {
        setInput(e.target.value);
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        //selenium get {name, price}

        const newItem ={
            link: input,
            name: `HP OMEN - 16.1" Laptop - AMD Ryzen 7 - 16GB Memory - AMD Radeon™ RX 6600M - 1TB SSD`,
            price: 999
        }
        props.addItem(newItem);

        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    return (
        <>
        <Button className="add-item" icon={<PlusSquareOutlined/>} onClick={showModal} type="dashed"/>
        <Modal title="Add Link" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Track BestBuy link</p>
            <Input placeholder="https://www.bestbuy.com" onChange={getInput}/>
        </Modal>
        </>
    );
};

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect( mapStateToProps, { addItem })(AddItemModal);