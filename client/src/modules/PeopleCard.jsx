import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAccessToken, getRole } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Table, Modal, Button, Icon, Card, Row, Col, Typography, Checkbox } from 'antd';
import { connect } from 'react-redux';
import PeopleForm from '../components/AdminForms/PeopleForm';

class PeopleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            modalVisible: false
        }
    }

    componentDidMount() {
        this.getPeopleData();
    };

    getPeopleData = () => {
        axios({
            method: 'get',
            url: `http://localhost:5000/api/squad/${this.props.location.pathname.split('/')[1]}/${this.props.location.pathname.split('/')[2]}/${this.props.location.pathname.split('/')[3]}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data)
                        this.setState({ data: data.people, loading: false });

                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    openModal = () => {
        this.setState({
            modalVisible: true
        });
    }

    closeModal = () => {
        this.setState({
            modalVisible: false
        })
    }

    render() {
        const { data: { name, secondName, midleName, rank, position, upload }, loading, modalVisible } = this.state;
        const { Title, Text, Paragraph } = Typography;
        return (
            <>
                <Card loading={loading}>
                    <Row type="flex">
                        <Title className="mr-10px mb-2px">{name}</Title>
                        <Title className="mt-0 mr-10px mb-2px">{secondName}</Title>
                        <Title className="mt-0 mb-2px">{midleName}</Title>
                    </Row>
                    <Row>
                        <Text className="rank">{position}</Text>
                    </Row>
                    <Row>
                        <Text className="rank">{rank && rank.name}</Text>
                    </Row>
                    <Row>
                        <img src={upload} className="avatar" alt="" />
                    </Row>
                    <Row>
                        <Button type="primary" icon="plus" onClick={this.openModal}>Добавить имущество</Button>
                    </Row>
                </Card>
                <Modal
                    title="Выдать имущество"
                    visible={modalVisible}
                    onCancel={this.closeModal}
                    onOk={this.openModal}
                >
                    {rank && rank.properties.map((item, index) => <>
                        <Row>
                            <Text key={index} className='property'>{item}</Text>
                            <Checkbox></Checkbox>
                        </Row>
                    </>
                    )}
                </Modal>
            </>
        );
    };
};

export default PeopleCard;
