import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { Table, Button, Modal, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { errorModalCreate } from '../helpers/Modals'
import { getRole } from '../helpers/Utils';
import { connect } from 'react-redux';
import SquadForm from '../components/AdminForms/SquadForm';

class List extends Component {
    state = {
        data: [],
        loading: true,
        modalVisible: false,
        mode: 'create',
        editbleData: {}
    }

    componentDidMount() {
        this.getData();
    };

    getData = (url) => {
        const { dataUrl, entity } = this.props;
        axios({
            method: 'get',
            url: dataUrl,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    let { data } = response;
                    if (data) {
                        console.log(data.squads)
                        this.setState({ data: data[entity], loading: false });
                    } else {
                        console.log(response);
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    deleteItem = (id) => {
        const { dataUrl, entity } = this.props;
        axios({
            method: 'delete',
            url: dataUrl + id,
            headers: { "Authorization": `Bearer ${getAccessToken()}` },
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data.squads)
                        this.setState({ data: data[entity], loading: false });
                    } else {
                        console.log(response);
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    setData = (data) => {
        this.setState({data})
    };

    openModal = (mode) => {
        this.setState({mode, modalVisible: true});
    };

    closeModal = () => {
        this.setState({modalVisible: false});
    };

    render() {
        const { data, loading, modalVisible, mode, editbleData } = this.state;
        const { role, adminColumns, columns, title } = this.props;
        return (
            <>
                <h1>{title}</h1>
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

export default connect(mapStateToProps)(List);
