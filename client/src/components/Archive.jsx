import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Table, Layout, Input } from 'antd';
import { Link } from 'react-router-dom';

class Archive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'Имя',
                    dataIndex: 'fullName',
                    render: (text, record) => <Link to={`/archive/${record._id}`} >{text}</Link>
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
            page: 0,
            size: 10,
            search: ''
        }
    };

    componentDidMount() {
        this.getArchive();
    };

    getArchive = () => {
        const { page, size, search } = this.state;
        let pageParam = `?page=${page}`;
        let sizeParam = `&size=${size}`;
        let searchParam = `&search=${search}`;
        let url = `http://localhost:5000/api/archive/${pageParam}${sizeParam}${searchParam}`
        axios({
            method: 'get',
            url,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        this.setState({
                            data: data.archive,
                            loading: false
                        }, () => this.formatPeople());
                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => {
                this.setState({ loading: false }, () => errorModalCreate(error.message))
            });
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

    handleTableChange = (pagination) => {
        this.setState({
            loading: true,
            size: pagination.pageSize,
            page: --pagination.current,
        }, () => this.getPeoples());
    };

    handleSearchChange = (value) => {
        this.setState({search: value}, () => this.getArchive());
    }

    render() {
        const { columns, loading, totalElements, formatedData } = this.state;
        const { Content } = Layout;
        return (
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <h1>Архив</h1>
                <Input.Search
                    className='mt-2'
                    enterButton='Искать'
                    placeholder='Введите фамилию'
                    size='large'
                    onSearch={value => this.handleSearchChange(value)}
                />
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={formatedData}
                    rowKey={(record) => record._id}
                    onChange={this.handleTableChange}
                    pagination={{
                        showSizeChanger: true,
                        total: totalElements
                    }}
                    className='mt-2'
                />
            </Content>
        );
    };
};

export default Archive;
