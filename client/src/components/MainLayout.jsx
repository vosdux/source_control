import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import { getRole } from '../helpers/Utils';

const { Header, Content } = Layout;

class MainLayout extends Component {
    handleExitClick = () => {
        localStorage.clear();
        this.props.userLoginAction(false);
    }

    render() {
        const { role } = this.props;
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    {getRole(role) === 'admin' || getRole(role) === 'specialist' ? <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                        defaultSelectedKeys={['1']}
                    >
                        <Menu.Item key="1">
                            <Link to={'/'}>Главная</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={'/archive'}>Архив</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to={'/norms'}>Нормы</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to={'/storage'}>Склад</Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to={'/property'}>Имущество</Link>
                        </Menu.Item>
                        <Menu.Item key="6" onClick={this.handleExitClick}>
                            Выйти
                        </Menu.Item>
                    </Menu> : <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                    >
                            <Menu.Item key="1">
                                <Link to={'/storage'}>Склад</Link>
                            </Menu.Item>
                            <Menu.Item key="2" onClick={this.handleExitClick}>
                                Выйти
                            </Menu.Item>
                        </Menu>}
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

const mapStateToProps = (state) => {
    const { role } = state
    return {
        role
    }
}

const mapDispatchToProps = {
    userLoginAction: actions.userLoginAction
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
