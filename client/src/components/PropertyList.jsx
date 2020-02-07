import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import { isLifeTimeEnd } from '../helpers/Utils';

class PropertyList extends Component {
    state = {
        columns: [
            {
                title: 'Наименование',
                dataIndex: 'property.name'
            },
            {
                title: 'Дата выдачи',
                dataIndex: 'date'
            },
            {
                title: 'Срок службы',
                dataIndex: 'lifeTime',
                render: (text, record) => text === true ? <Icon type="check" style={{ color: '#00B75B', fontSize: '25px' }}/> : <Icon type="close" style={{ color: '#800000', fontSize: '25px' }}/>
            }
        ]
    };

    componentDidMount() {
        this.convertDate()
    };

    convertDate = () => {
        const { property } = this.props;
        let convertedProperty = isLifeTimeEnd(property)
        this.setState({convertedProperty}, () => console.log(this.state.convertedProperty))
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
