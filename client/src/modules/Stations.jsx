import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAccessToken } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Table } from 'antd';

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
            loading: true
        }
    }

    componentDidMount() {
        this.getStations();
    };

    getStations = () => {
        axios({
            method: 'get',
            url: `http://localhost:5000/api/squad/${this.props.location.pathname.split('/')[1]}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data)
                        this.setState({ data: data.stations, loading: false});
                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    render() {
        const { data, columns, loading } = this.state;
        return (
            <Table 
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey={(record) => record._id}
            />
        );
    };
};

export default Stations;