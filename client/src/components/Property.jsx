import React, { Component } from 'react';
import List from './List';
import PropertyForm from './AdminForms/PropertyForm';

class Property extends Component {
    state = {
        columns: [
            {
                title: 'Наименвание',
                dataIndex: 'name'
            },
            {
                title: 'Англ. наименование',
                dataIndex: 'fieldName'
            },
            {
                title: 'Срок носки',
                dataIndex: 'lifeTime'
            }
        ],
        permissons: {
            add: true,
            edit: true,
            delete: true
        }
    };

    render() {
        const { columns, permissons } = this.state;
        return (
            <List
                title='Имущество'
                dataUrl={`api/property/`}
                AddForm={PropertyForm}
                columns={columns}
                permissons={permissons}
                enableSearch={false}
                statistic={false}
            />
        );
    };
};

export default Property;