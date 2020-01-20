import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { Table, Button, Modal, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { errorModalCreate } from '../helpers/Modals'
import { getRole } from '../helpers/Utils';
import { connect } from 'react-redux';
import SquadForm from '../components/AdminForms/SquadForm';

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
                render: (text, record) => <Icon type="edit" onClick={() => {this.openModal('edit'); this.setState({editbleData: record})}}/>
            },
            {
                title: '',
                key: 'delete',
                render: () => <Icon type="delete" />
            },
        ],
        loading: true,
        modalVisible: false,
        mode: 'create',
        editbleData: {}
    }

    componentDidMount() {
        this.getSquads();
    };

    getSquads = () => {
        axios({
            method: 'get',
            url: 'http://localhost:5000/api/squad',
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    let { data } = response;
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
        this.setState({data})
    }

    openModal = (mode) => {
        this.setState({mode, modalVisible: true});
    };

    closeModal = () => {
        this.setState({modalVisible: false});
    };

    render() {
        const { columns, data, loading, modalVisible, adminColumns, mode, editbleData } = this.state;
        const { role } = this.props;
        return (
            <>
                <h1>Отряды ФПС МЧС России по Московской области</h1>
                {getRole(role) === 'admin' && <Button type='primary' icon="plus" onClick={() => this.openModal('create')}>Добавить</Button>}
                <Table
                    columns={getRole(role) === 'admin' ? adminColumns : columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record._id}
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
            </>
        );
    };
};


const mapStateToProps = (state) => {
    const { role } = state;
    return {role};
}

export default connect(mapStateToProps)(Squads);