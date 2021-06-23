import React from 'react';
import { Layout } from 'antd';
import PriceAlert from './PriceAlert';
const { Content } = Layout;

export default class MainContent extends React.Component {
    
    contentSelector = () =>{
        const key = this.props.getContentKey();
        console.log(key);
        switch(key) {
            case 'PRICE_ALERT':
                return <PriceAlert/>;
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