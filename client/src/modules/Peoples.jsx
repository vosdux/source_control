import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAccessToken, getRole } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Table, Modal, Button, Icon, Tabs } from 'antd';
import { connect } from 'react-redux';
import PeopleForm from '../components/AdminForms/PeopleForm';
import StatisticModule from '../components/Statistic';
import { Layout } from 'antd';

class Peoples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [
                {
                    title: 'Имя',
                    dataIndex: 'fullName',
                    render: (text, record) => <Link to={`/${record._id}`} >{text}</Link>
                },
                {
                    title: 'Звание',
                    dataIndex: 'rank',
                },
                {
                    title: 'Должность',
                    dataIndex: 'position',
                },
            ],
            loading: true,
            adminColumns: [
                {
                    title: 'Имя',
                    dataIndex: 'fullName',
                    render: (text, record) => <Link to={`/${this.props.location.pathname.split('/')[1]}/${this.props.location.pathname.split('/')[2]}/${record._id}`} >{text}</Link>
                },
                {
                    title: 'Звание',
                    dataIndex: 'rank',
                },
                {
                    title: 'Должность',
                    dataIndex: 'position',
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
        }
    }

    componentDidMount() {
        this.setState({
            squadId: this.props.location.pathname.split('/')[1],
            stationId: this.props.location.pathname.split('/')[2]
        }, () => this.getPeoples());
    };

    getPeoples = () => {
        const { squadId, stationId } = this.state;
        this.setState({loading: true});
        axios({
            method: 'get',
            url: `http://localhost:5000/api/squad/${squadId}/${stationId}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data)
                        this.setState({ data: data.peoples, loading: false }, () => this.formatPeople());
                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    formatPeople = () => {
        const { data } = this.state;
        let newData = data.map(item => {
            return {
                _id: item._id,
                fullName: `${item.secondName} ${item.secondName} ${item.midleName !== undefined ? item.midleName : ''}`,
                rank: item.rank.name,
                position: item.position
            }
        });
        this.setState({ formatedData: newData })
    };

    openModal = (mode) => {
        this.setState({ mode, modalVisible: true });
    };

    closeModal = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        const { data, columns, loading, adminColumns, editbleData, modalVisible, mode, formatedData, squadId, stationId } = this.state;
        const { role } = this.props;
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
                        <h1>Сотрудники</h1>
                        <Button type='primary' icon="plus" onClick={() => this.openModal('create')}>Добавить</Button>
                        <Table
                            dataSource={formatedData}
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
                            stationId={stationId}
                        />
                    </TabPane>
                </Tabs>
                <Modal
                    visible={modalVisible}
                    onCancel={this.closeModal}
                    footer={false}
                >
                    <PeopleForm
                        setData={this.setData}
                        closeModal={this.closeModal}
                        mode={mode}
                        editbleData={editbleData}
                        squadId={this.props.location.pathname.split('/')[1]}
                        stationId={this.props.location.pathname.split('/')[2]}
                        getPeoples={this.getPeoples}
                    />
                </Modal>
            </Content>
        );
    };
};

const mapStateToProps = (state) => {
    const { role } = state;
    return { role };
}

export default connect(mapStateToProps)(Peoples);
