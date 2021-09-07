import React from 'react';
import { Layout } from 'antd';
import PriceAlert from './PriceAlert';
import InBound from './InBound';
const { Content } = Layout;

export default class MainContent extends React.Component {
    
    contentSelector = () =>{
        const key = this.props.getContentKey();
        switch(key) {
            case 'PRICE_ALERT':
                return <PriceAlert socket={this.props.socket}/>;
            // case 'PURCHASE_BOT':
            //     return <PurchaseBot/>;
            case 'INBOUND':
                return <InBound/>;
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