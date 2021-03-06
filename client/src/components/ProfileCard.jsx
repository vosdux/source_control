import React, { Component } from 'react';
import { Button, Card, Row, Typography, Skeleton } from 'antd';
import profilePlaceholder from '../profile-placeholder.png';

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { people, loading, archived } = this.props;
        const { Title, Text } = Typography;
        return (

            <Card>
                <Skeleton loading={loading}>
                    {archived && <Title className='error'>Уволен</Title>}
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
                        <Text className="rank">№{people && people.idcard}</Text>
                    </Row>
                    <Row>
                        <img src={people && people.upload ? people.upload : profilePlaceholder} className="avatar" alt="Аватар пользователя" />
                    </Row>
                    {!archived && <>
                        <Row>
                            <Button type="primary" icon="plus" onClick={() => this.props.openModal(true)}>Выдать накладную</Button>
                        </Row>
                        <Row className='mt-2'>
                            <Button type="default" icon="plus" onClick={() => this.props.openModal(false)}>Добавить имущество</Button>
                        </Row>
                    </>}
                </Skeleton>
            </Card>
        );
    };
};

export default ProfileCard;
