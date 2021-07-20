import React from 'react';
import { Layout } from 'antd';
import PriceAlert from './PriceAlert';
const { Content } = Layout;

export default class MainContent extends React.Component {
    
    contentSelector = () =>{
        const key = this.props.getContentKey();
        switch(key) {
            case 'PRICE_ALERT':
                return <PriceAlert socket={this.props.socket}/>;
            // case 'PURCHASE_BOT':
            //     return <PurchaseBot/>;
            default:
                break;
        }
    }
    render(){
        return(
            <Content>
                {this.contentSelector()}
            </Content>
        );
    }
}