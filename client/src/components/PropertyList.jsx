import React, { Component } from 'react';
import { Table, Icon, Typography } from 'antd';
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
                title: 'Кол-во',
                dataIndex: 'count'
            },
            {
                title: 'Необходимо',
                dataIndex: 'countNorm'
            },
            {
                title: 'Срок службы',
                dataIndex: 'lifeTime',
                render: (text, record) => text === true ? <Icon type="check" style={{ color: '#00B75B', fontSize: '25px' }}/> : <Icon type="close" style={{ color: '#800000', fontSize: '25px' }}/>
            }
        ]
    };

    componentDidMount() {
        this.getStatus()
    };

    getStatus = () => {
        const { property } = this.props;
        let convertedProperty = property.map(item => {
            item.lifeTime = isLifeTimeEnd(item);
            return item;
        })
        this.setState({convertedProperty})
    }

    render() {
        const { columns, convertedProperty } = this.state;
        const { propertyCountNorm } = this.props;
        const { Text } = Typography;
        let givenCounter = 0;
        convertedProperty && convertedProperty.forEach(item => {
            if(item.lifeTime) {
                ++givenCounter;
            }
        });
        let complete = false;
        if (givenCounter == propertyCountNorm) {
            complete = true
        }
        return (
            <>
                <Table
                    dataSource={convertedProperty}
                    columns={columns}
                    rowKey={record => record._id}
                />
                <div className='d-flex'>
                    <Text className='card-text'>{`Выдано: ${givenCounter}`}</Text>
                </div>
                <div className="d-flex">
                    <Text className='card-text'>{`Положено: ${propertyCountNorm}`}</Text>
                </div>
                <div className='d-flex'>
                    <Text className='card-text mt-2'>{complete ? 'Укомплектован' : 'Неукомплектован'}</Text>
                </div>
            </>
        );
    };
};

export default PropertyList;
