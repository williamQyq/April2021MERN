import React from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import 'styles/login.scss';
import { Link } from "react-router-dom";

const { Sider, Header, Content, Footer } = Layout;

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
            <Layout className="login-layout">
                <Sider></Sider>
                <Layout>
                    <Content></Content>
                    <Footer></Footer>
                </Layout>
            </Layout>


        );
    }



}