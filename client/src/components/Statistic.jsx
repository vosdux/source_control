import React, { Component } from 'react';
import axios from 'axios';
import { getAccessToken } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Table, Modal, Button, Icon, Card, Row, Typography, Menu, Tabs } from 'antd';

class Statistic extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
    };

    getPeopleData = () => {
        // axios({
        //     method: 'get',
        //     url: `http://localhost:5000/api/squad/${this.props.location.pathname.split('/')[1]}/${this.props.location.pathname.split('/')[2]}/${this.props.location.pathname.split('/')[3]}`,
        //     headers: { "Authorization": `Bearer ${getAccessToken()}` }
        // })
        //     .then((response) => {
        //         if (response.status === 200) {
        //             const { data } = response;
        //             if (data) {
        //                 console.log(data)
        //                 this.setState({ data: data, loading: false });

        //             } else {
        //                 console.log(response)
        //             }
        //         }
        //     })
        //     .catch((error) => errorModalCreate(error.message));
    };

    render() {
        return (
            <>
                TAB
            </>
        );
    };
};

export default Statistic;
