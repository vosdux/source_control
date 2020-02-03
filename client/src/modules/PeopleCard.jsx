import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Table, Modal, Button, Icon, Card, Row, Typography, Menu } from 'antd';
import PropertyForm from '../components/Forms/PropertyForm';
import PropertyList from '../components/PropertyList';
import { Layout } from 'antd';

class PeopleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            modalVisible: false,
            propertyModalVisible: false,
            propertyModalTitle: ''
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

    openPropertyModal = (name) => {
        const { data } = this.state
        let result = [];
        data && data.property.forEach(item => {
            if (item.name === name) {
                result.push(item);
            }
        });
        this.setState({ property: result, propertyModalVisible: true, propertyModalTitle: name });
    };

    closePropertyModal = () => {
        this.setState({propertyModalVisible: false});
    };

    render() {
        const { data: { people, norm }, loading, modalVisible, propertyModalVisible, property, propertyModalTitle } = this.state;
        const { Title, Text } = Typography;
        const { Content, Sider } = Layout;
        const { SubMenu } = Menu;
        console.log(this.state.data)
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
                            {norm && norm[0].properties.map(item => <Menu.Item
                                key={item.fieldName}
                                onClick={() => this.openPropertyModal(item.name)}
                            >{item.name}</Menu.Item>)}
                        </SubMenu>

                    </Menu>
                </Sider>
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    <Card loading={loading}>
                        <Row type="flex">
                            <Title className="mr-10px mb-2px">{people && people.name}</Title>
                            <Title className="mt-0 mr-10px mb-2px">{people && people.secondName}</Title>
                            <Title className="mt-0 mb-2px">{people && people.midleName}</Title>
                        </Row>
                        <Row>
                            <Text className="rank">{people && people.position}</Text>
                        </Row>
                        <Row>
                            <Text className="rank">{people && people.rank.name}</Text>
                        </Row>
                        <Row>
                            <img src={people && people.upload} className="avatar" alt="" />
                        </Row>
                        <Row>
                            <Button type="primary" icon="plus" onClick={this.openModal}>Добавить имущество</Button>
                        </Row>
                    </Card>
                    <Modal
                        title="Выдать имущество"
                        visible={modalVisible}
                        onCancel={this.closeModal}
                        onOk={this.openModal}
                        footer={false}
                    >
                        <PropertyForm
                            properties={norm && norm[0].properties}
                            peopleId={this.props.location.pathname.split('/')[3]}
                            squadId={this.props.location.pathname.split('/')[1]}
                            statioId={this.props.location.pathname.split('/')[2]}
                            closeModal={this.closeModal}
                        />
                    </Modal>
                    <Modal
                        title={propertyModalTitle}
                        visible={propertyModalVisible}
                        onCancel={this.closePropertyModal}
                        destroyOnClose={true}
                    >
                        <PropertyList property={property}/>
                    </Modal>
                </Content>
            </>
        );
    };
};

export default PeopleCard;
