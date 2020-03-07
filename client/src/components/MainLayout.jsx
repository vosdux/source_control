import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class MainLayout extends Component {
    handleExitClick = () => {
        localStorage.clear();
        this.props.userLoginAction(false);
    }

    render() {
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">
                            <Link to={'/'}>Главная</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={'/archive'}>Архив</Link>
                        </Menu.Item><Menu.Item key="3">
                            <Link to={'/archive'}>Нормы</Link>
                        </Menu.Item>

                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Layout style={{ padding: '24px 0', background: '#fff', marginTop: '50px' }}>
                        {this.props.children}
                    </Layout>
                </Content>
            </Layout>
        );
    };
};

const mapDispatchToProps = {
    userLoginAction: actions.userLoginAction
}

export default connect(null, mapDispatchToProps)(MainLayout);
