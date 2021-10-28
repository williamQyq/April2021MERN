import React from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

const { Sider,Header,Content,Footer } = Layout;
export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }


    render() {
        return (
            <Layout>
                <Sider></Sider>
                <Layout>
                    <Header></Header>
                    <Content></Content>
                    <Footer></Footer>
                </Layout>
            </Layout>


        );
    }



}