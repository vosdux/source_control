import React, { Component } from 'react';
import { Button, Card, Row, Typography } from 'antd';

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { people, loading } = this.props;
        const { Title, Text } = Typography;
        return (

            <Card loading={loading}>
                <Row type="flex">
                    <Title className="mr-10px mb-2px">{people && people.name}</Title>
                    <Title className="mt-0 mr-10px mb-2px">{people && people.secondName}</Title>
                    <Title className="mt-0 mb-2px">{people && people.midleName}</Title>
                </Row>
                <Row>
                    <Text className="rank">{people && people.position}</Text>
                </Row>
                <Row>
                    <Text className="rank">{people && people.rank.name}</Text>
                </Row>
                <Row>
                    <img src={people && people.upload} className="avatar" alt="" />
                </Row>
                <Row>
                    <Button type="primary" icon="plus" onClick={this.props.openModal}>Добавить имущество</Button>
                </Row>
            </Card>
        );
    };
};

export default ProfileCard;