import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { Table, Button, Modal, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { errorModalCreate } from '../helpers/Modals'
import { getRole } from '../helpers/Utils';
import { connect } from 'react-redux';
import SquadForm from '../components/AdminForms/SquadForm';
import { Layout } from 'antd';

class Squads extends Component {
    state = {
        data: [],
        columns: [
            {
                title: 'Наименование',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Link to={`/${record._id}`} >{text}</Link>
            }
        ],
        adminColumns: [
            {
                title: 'Наименование',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Link to={`/${record._id}`} >{text}</Link>
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
        modalVisible: false,
        mode: 'create',
        editbleData: {},
        page: 0,
        size: 10
    }

    componentDidMount() {
        this.getSquads();
    };

    getSquads = () => {
        const { page, size } = this.state;
        let pageParam = `?page=${page}`;
        let sizeParam = `&size=${size}`;
        axios({
            method: 'get',
            url: `http://localhost:5000/api/squad${pageParam}${sizeParam}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    let { data } = response;
                    if (data) {
                        console.log(data.squads)
                        this.setState({ 
                            data: data.squads,
                            totalElements: data.totalElements, 
                            loading: false 
                        });
                    } else {
                        console.log(response);
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    deleteItem = (id) => {
        axios({
            method: 'delete',
            url: `http://localhost:5000/api/squad/${id}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` },
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data.squads)
                        this.setState({ data: data.squads, loading: false });
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

    handleTableChange = (pagination) => {
        this.setState({
            loading: true,
            size: pagination.pageSize,
            page: --pagination.current,
        }, () => this.getSquads());
    };

    render() {
        const { columns, data, loading, modalVisible, adminColumns, mode, editbleData, totalElements } = this.state;
        const { role } = this.props;
        const { Content } = Layout;
        return (
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <h1>Отряды ФПС МЧС России по Московской области</h1>
                {getRole(role) === 'admin' && <Button type='primary' icon="plus" onClick={() => this.openModal('create')}>Добавить</Button>}
                <Table
                    columns={getRole(role) === 'admin' ? adminColumns : columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record._id}
                    onChange={this.handleTableChange}
                    pagination={{
                        showSizeChanger: true,
                        total: totalElements
                    }}
                />
                {getRole(role) === 'admin' && <Modal
                    visible={modalVisible}
                    onCancel={this.closeModal}
                    footer={false}
                >
                    <SquadForm
                        setData={this.setData}
                        closeModal={this.closeModal}
                        mode={mode}
                        editbleData={editbleData}
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

export default connect(mapStateToProps)(Squads);
