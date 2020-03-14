import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Modal, Icon, Menu, Tabs, } from 'antd';
import PropertyForm from '../components/Forms/PropertyForm';
import PropertyList from '../components/PropertyList';
import Dismissal from '../components/Dismissal';
import ProfileCard from '../components/ProfileCard';
import { getAccessToken, refreshToken } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';

class PeopleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalVisible: false,
            propertyModalVisible: false,
            propertyModalTitle: '',
            disadvantage: []
        }
    }

    componentDidMount() {
        this.getPeopleData();
    };

    getPeopleData = async () => {
        try {
            const { archived, location } = this.props;
            let url = `http://localhost:5000/api/squad/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}/${this.props.location.pathname.split('/')[3]}`;
            if (archived) {
                url = `http://localhost:5000/api/archive/${location.pathname.split('/')[2]}`;
            }
            await refreshToken();
            const response = await axios({
                method: 'get',
                url,
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })
            if (response.status === 200) {
                const { data } = response;
                if (data) {
                    this.setState({ data: data, loading: false });
                }
            }
        } catch (error) {
            errorModalCreate(error.message)
        }
    };

    archivePeople = async () => {
        try {
            const { location: { pathname } } = this.props;
            await refreshToken();
            const response = await axios({
                method: 'delete',
                url: `http://localhost:5000/api/squad/${pathname.split('/')[1]}/${pathname.split('/')[2]}/${pathname.split('/')[3]}`,
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            });
            if (response.status === 200) {
                this.props.history.push(`http://localhost:5000/api/squad/${pathname.split('/')[1]}/${pathname.split('/')[2]}/`);
            }
        } catch (error) {
            errorModalCreate(error.message);
        }
    }

    openModal = (isDocumentModal) => {
        this.setState({
            modalVisible: true,
            isDocumentModal
        });
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        })
    };

    openPropertyModal = (name, propertyCountNorm, propertyId) => {
        const { data } = this.state
        let result = [];
        data.people.propertyes.forEach(item => {
            if (item.property && item.property.name === name) {
                result.push(item);
            }
        });
        this.setState({ property: result, propertyCountNorm, propertyModalVisible: true, propertyModalTitle: name, propertyId });
    };

    closePropertyModal = () => {
        this.setState({ propertyModalVisible: false });
    };

    onGetPeopleData = () => {
        this.setState({ loading: true }, () => this.getPeopleData());
    };

    onArchivePeople = () => {
        this.setState({ loading: false }, () => this.archivePeople())
    }

    render() {
        const {
            data: { people, norm },
            loading, modalVisible,
            propertyModalVisible,
            property,
            propertyModalTitle,
            propertyCountNorm,
            isDocumentModal,
            propertyId
        } = this.state;
        const { archived } = this.props;
        const { Content, Sider } = Layout;
        const { SubMenu } = Menu;
        const { TabPane } = Tabs;
        return (
            <>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%' }}
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="user" />
                                    Имущество
                                </span>
                            }
                        >
                            {norm && norm.properties.map(item => <Menu.Item
                                key={item.property.fieldName}
                                onClick={() => this.openPropertyModal(item.property.name, item.count, item.property._id)}
                            >{item.property.name}</Menu.Item>)}
                        </SubMenu>
                    </Menu>
                </Sider>
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane
                            tab={
                                <span>
                                    <Icon type="profile" />
                                    Профиль
                                </span>
                            }
                            key="1"
                        >
                            <ProfileCard
                                archived={archived}
                                loading={loading}
                                openModal={this.openModal}
                                people={people}
                            />
                        </TabPane>
                        {!archived && <TabPane
                            tab={
                                <span>
                                    <Icon type="solution" />
                                    Статистика
                                </span>
                            }
                            key="2"
                        >
                            Здесь что-то будет(но это не точно)
                        </TabPane>}
                        {!archived && <TabPane
                            tab={
                                <span>
                                    <Icon type="form" />
                                    Уволить
                                </span>
                            }
                            key="3"
                        >
                            <Dismissal
                                idcard={people && people.idcard}
                                archivePeople={this.onArchivePeople}
                            />
                        </TabPane>}
                    </Tabs>

                    <Modal
                        title={isDocumentModal ? "Выдать накладную" : "Выдать имущество"}
                        visible={modalVisible}
                        onCancel={this.closeModal}
                        footer={false}
                        destroyOnClose={true}
                    >
                        <PropertyForm
                            properties={norm && norm.properties}
                            peopleId={this.props.location.pathname.split('/')[3]}
                            closeModal={this.closeModal}
                            getPeopleData={this.onGetPeopleData}
                            isDocumentModal={isDocumentModal}
                        />
                    </Modal>
                    <Modal
                        title={propertyModalTitle}
                        visible={propertyModalVisible}
                        onCancel={this.closePropertyModal}
                        destroyOnClose={true}
                        width={1000}
                        footer={false}
                    >
                        <PropertyList
                            peopleId={this.props.location.pathname.split('/')[3]}
                            property={property}
                            propertyCountNorm={propertyCountNorm}
                            propertyId={propertyId}
                        />
                    </Modal>
                </Content>
            </>
        );
    };
};

export default PeopleCard;
