import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAccessToken } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Table, Modal, Button, Icon, Tabs } from 'antd';
import { getRole } from '../helpers/Utils';
import { connect } from 'react-redux';
import StationForm from '../components/AdminForms/StationForm';
import StatisticModule from '../components/Statistic';
import { Layout } from 'antd';

class Stations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [
                {
                    title: 'Наименование',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record) => <Link to={`/${this.props.location.pathname.split('/')[1]}/${record._id}`} >{text}</Link>
                },
                {
                    title: 'Город',
                    dataIndex: 'place',
                    key: 'place',
                },
            ],
            adminColumns: [
                {
                    title: 'Наименование',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record) => <Link to={`/${this.props.location.pathname.split('/')[1]}/${record._id}`} >{text}</Link>
                },
                {
                    title: 'Город',
                    dataIndex: 'place',
                    key: 'place'
                },
                {
                    title: '',
                    key: 'edit',
                    render: (text, record) => <Icon type="edit" onClick={() => { this.openModal('edit'); this.setState({ editbleData: record }) }} />
                },
                {
                    title: '',
                    key: 'delete',
                    render: (text, record) => <Icon type="delete" onClick={() => this.deleteItem(record._id)} />
                },
            ],
            loading: true,
            modalVisible: false
        }
    }

    componentDidMount() {
        this.setState({squadId: this.props.location.pathname.split('/')[1]}, () => this.getStations())
    };

    getStations = () => {
        const { squadId } = this.state;
        axios({
            method: 'get',
            url: `http://localhost:5000/api/squad/${squadId}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data)
                        this.setState({ data: data.stations, loading: false });
                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    deleteItem = (id) => {
        const { squadId } = this.state;
        axios({
            method: 'delete',
            url: `http://localhost:5000/api/squad/${squadId}/${id}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` },
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        this.setState({ data: data.stations, loading: false });
                    } else {
                        console.log(response);
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    setData = (data) => {
        this.setState({ data })
    };

    openModal = (mode) => {
        this.setState({ mode, modalVisible: true });
    };

    closeModal = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        const { data, columns, loading, modalVisible, mode, editbleData, adminColumns, squadId } = this.state;
        const { role, location: { pathname } } = this.props;
        const { Content } = Layout;
        const { TabPane } = Tabs;
        return (
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
                        <h1>Пожарные части</h1>
                        {getRole(role) === 'admin' && <Button type='primary' icon="plus" onClick={() => this.openModal('create')}>Добавить</Button>}
                        <Table
                            dataSource={data}
                            columns={getRole(role) === 'admin' ? adminColumns : columns}
                            loading={loading}
                            rowKey={(record) => record._id}
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
                        <StatisticModule
                            squadId={squadId}
                        />
                    </TabPane>
                </Tabs>
                {getRole(role) === 'admin' && <Modal
                    visible={modalVisible}
                    onCancel={this.closeModal}
                    footer={false}
                >
                    <StationForm
                        setData={this.setData}
                        closeModal={this.closeModal}
                        mode={mode}
                        editbleData={editbleData}
                        squadId={squadId}
                    />
                </Modal>}
            </Content>
        );
    };
};

const mapStateToProps = (state) => {
    const { role } = state;
    return { role };
}

export default connect(mapStateToProps)(Stations);
