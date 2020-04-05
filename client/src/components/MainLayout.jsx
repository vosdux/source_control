import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRole } from '../helpers/Utils';

const { Header, Content } = Layout;

class MainLayout extends Component {

    state = {
        adminMenu: [
            { to: '/', label: 'Главная' },
            { to: '/archive', label: 'Архив' },
            { to: '/norms', label: 'Нормы' },
            { to: '/storage', label: 'Склад' },
            { to: '/property', label: 'Имущество' },
        ],
        specialistMenu: [
            { to: '/', label: 'Главная' },
            { to: '/archive', label: 'Архив' },
            { to: '/norms', label: 'Нормы' },
            { to: '/storage', label: 'Склад' },
        ],
        storageMenu: [
            { to: '/storage', label: 'Склад' },
        ],
    };

    renderMenu = (role) => {
        const { adminMenu, specialistMenu, storageMenu } = this.state;
        let menuItems = [];
        switch (getRole(role)) {
            case 'admin':
                menuItems = adminMenu;
                break;
            case 'specialist':
                menuItems = specialistMenu;
                break;
            case 'storage':
                menuItems = storageMenu;
                break;
            default:
                menuItems = specialistMenu;
        }

        console.log(this.props);

        return (
            <Menu
                theme="dark"
                mode="horizontal"
                style={{ lineHeight: '64px' }}
            >
                {adminMenu.map((item, index) => <Menu.Item key={index}>
                    <Link to={item.to}>{item.label}</Link>
                </Menu.Item>)}
                <Menu.Item key={adminMenu.length} onClick={this.props.logoutHandler}>
                    Выйти
                </Menu.Item>
            </Menu>
        );
    };

    render() {
        const { role } = this.props;
        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    {this.renderMenu(role)}
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
};

export default connect(mapStateToProps, null)(MainLayout);
