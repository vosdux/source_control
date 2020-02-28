import React, { Component } from 'react';
import { Table, Icon, Typography, Button } from 'antd';
import axios from 'axios';
import { isLifeTimeEnd } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { getAccessToken } from '../helpers/Utils';
import moment from 'moment'

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
                render: (text, record) => text === true ? <Icon type="check" style={{ color: '#00B75B', fontSize: '25px' }} /> : <Icon type="close" style={{ color: '#800000', fontSize: '25px' }} />
            },
            {
                render: (text, record) => record.discarded ? 'Списано' : <Button onClick={() => this.discardProperty(record)}>Списать</Button>
            }
        ],
        property: this.props.property,
        loading: false
    };

    componentDidMount() {
        this.getStatus()
    };

    discardProperty = (record) => {
        this.setState({loading: true});
        const { peopleId, propertyId } = this.props;
        let url = `http://localhost:5000/api/property/${peopleId}/discard/${record._id}`;

        axios({
            method: 'put',
            url,
            data: {},
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then(response => {
                if (response.status === 200) {
                    const { data } = response;
                    let property = data.people.propertyes.filter(elem => elem.property._id === propertyId)
                    this.setState({
                        loading: false,
                        property: property
                    }, () => this.getStatus());
                } else {
                    console.log(response);
                }
            })
            .catch(error => {
                if (error.response !== undefined) {
                    errorModalCreate(error.response.data.message);
                } else {
                    errorModalCreate(error);
                }
            });
    }

    getStatus = () => {
        const { property } = this.state;
        let convertedProperty = property.map(item => {
            if (item.discarded) {
                let date = item.date && item.date.split('T')[0];
                item.date = date;
                item.lifeTime = false
            } else {
                item.lifeTime = isLifeTimeEnd(item);
            }
            return item;
        })
        this.setState({ convertedProperty })
    }

    render() {
        const { columns, convertedProperty, loading } = this.state;
        const { propertyCountNorm } = this.props;
        const { Text } = Typography;
        let givenCounter = 0;
        convertedProperty && convertedProperty.forEach(item => {
            if (item.lifeTime) {
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
                    loading={loading}
                />
                <div className='d-flex'>
                    <Text className='card-text'>{`Выдано: ${givenCounter}`}</Text>
                </div>
                <div className="d-flex">
                    <Text className='card-text'>{`Положено: ${propertyCountNorm}`}</Text>
                </div>
                <div className='d-flex'>
                    {complete ? <Text strong className='card-text mt-2 success'>Укомплектован</Text> :
                        <Text strong className='card-text mt-2 error'>Неукомплектован</Text>}
                </div>
            </>
        );
    };
};

export default PropertyList;
