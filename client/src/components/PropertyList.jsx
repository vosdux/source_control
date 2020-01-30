import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { Table, Button, Modal } from 'antd';
import { errorModalCreate } from '../helpers/Modals'
import { getRole } from '../helpers/Utils';
import SquadForm from '../components/AdminForms/SquadForm';

class PropertyList extends Component {
    state = {
        columns: [
            {
                title: 'Наименование',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Дата выдачи',
                dataIndex: 'date',
                key: 'date'
            }
        ]
    };

    componentDidMount() {
        this.convertDate()
    };

    convertDate = () => {
        const { property } = this.props;
        property.forEach(item => {
            let date = item.date && item.date.split('T')[0];
            item.date = date;
        });
        this.setState({convertedProperty: property})
    }

    render() {
        const { columns, convertedProperty } = this.state;
        return (
            <>
                <Table
                    dataSource={convertedProperty}
                    columns={columns}
                    rowKey={record => record._id}
                />
            </>
        );
    };
};

export default PropertyList;
