import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Modal, Icon, Menu, Tabs, Spin } from 'antd';
import PropertyForm from '../components/Forms/PropertyForm';
import PropertyList from '../components/PropertyList';
import Statistic from '../components/Statistic';
import ProfileCard from '../components/ProfileCard';
import { getAccessToken, isLifeTimeEnd } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';

class PeopleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            modalVisible: false,
            propertyModalVisible: false,
            propertyModalTitle: '',
            disadvantage: []
        }
    }

    componentDidMount() {
        this.getPeopleData();
    };

    getPeopleData = () => {
        axios({
            method: 'get',
            url: `http://localhost:5000/api/squad/${this.props.location.pathname.split('/')[1]}/${this.props.location.pathname.split('/')[2]}/${this.props.location.pathname.split('/')[3]}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data)
                        this.setState({ data: data, loading: false });

                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    // statistic = () => {
    //     const { data: { norm, people } } = this.state;
    //     let property = [];
    //     console.log(people)
    //     if (people && people.propertyes) {
    //         property = isLifeTimeEnd(people.propertyes);
    //     }

    //     console.log(property);
    //     let convertedProperty = [];
    //     property.forEach(item => {
    //         if (item.lifeTime) {
    //             convertedProperty.push(item.property._id);
    //         }
    //     })
    //     console.log(convertedProperty);
    //     let disadvantage = norm[0].properties.filter(item => !~convertedProperty.indexOf(item._id));
    //     this.setState({disadvantage});
    // }

    openModal = () => {
        this.setState({
            modalVisible: true
        });
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        })
    };

    openPropertyModal = (name, propertyCountNorm) => {
        const { data } = this.state
        let result = [];
        data.people.propertyes.forEach(item => {
            if (item.property && item.property.name === name) {
                result.push(item);
            }
        });
        this.setState({ property: result, propertyCountNorm, propertyModalVisible: true, propertyModalTitle: name });
    };

    closePropertyModal = () => {
        this.setState({ propertyModalVisible: false });
    };

    render() {
        const { data: { people, norm }, loading, modalVisible, propertyModalVisible, property, propertyModalTitle, disadvantage, propertyCountNorm } = this.state;
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
                                onClick={() => this.openPropertyModal(item.property.name, item.count)}
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
                                loading={loading}
                                openModal={this.openModal}
                                people={people}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <Icon type="solution" />
                                    Статистика
                                </span>
                            }
                            key="2"
                        >
                            <Statistic
                                disadvantage={disadvantage}
                            />
                        </TabPane>
                    </Tabs>

                    <Modal
                        title="Выдать имущество"
                        visible={modalVisible}
                        onCancel={this.closeModal}
                        footer={false}
                        destroyOnClose={true}
                    >
                        <PropertyForm
                            properties={norm && norm.properties}
                            peopleId={this.props.location.pathname.split('/')[3]}
                            squadId={this.props.location.pathname.split('/')[1]}
                            statioId={this.props.location.pathname.split('/')[2]}
                            closeModal={this.closeModal}
                            getPeopleData={this.getPeopleData}
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
                            property={property}
                            propertyCountNorm={propertyCountNorm}
                        />
                    </Modal>
                </Content>
            </>
        );
    };
};

export default PeopleCard;
