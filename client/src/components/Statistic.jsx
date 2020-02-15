import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Button, Col, Row, Statistic } from 'antd';

class StatisticModule extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.getPeoples();
    };

    getPeoples = () => {
        const { squadId, stationId } = this.props;
        axios({
            method: 'get',
            url: `http://localhost:5000/api/statistic/station/${stationId}`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        this.setState({data});
                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    };

    render() {
        const { data } = this.state;
        return (
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic title="Всего людей" value={data && data.peoples} />
                </Col>
                <Col span={12}>
                    <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
                    <Button style={{ marginTop: 16 }} type="primary">
                        Recharge
                    </Button>
                </Col>
            </Row>
        );
    };
};

export default StatisticModule;
