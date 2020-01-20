import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, Card } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import axios from 'axios';

class AdminForm extends Component {
    state = {
        loading: false
    };

    loginHandler = (accessToken, refreshToken, role) => {
        localStorage.setItem('userData', JSON.stringify({
            accessToken,
            refreshToken
        }));
        this.props.userLoginAction(true, role);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                axios({
                    method: 'post',
                    url: 'http://localhost:5000/api/squad',
                    data: values
                })
                    .then(response => {
                        if (response.status === 200) {
                            const { data } = response;
                            console.log(data)
                            if (data) {
                                this.props.setData(data.squads);
                            }
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
                    })
            }
            this.props.closeModal();
        });
    };

    render() {
        console.log(this.props.editibleData)
        const { mode, editibleData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="squad-form">
                <h1>Создание отряда</h1>
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Введите название отряда' }],
                        initialValue: mode === 'edit' ? editibleData.name : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Название отряда"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const SquadForm = Form.create({ name: 'squad_form' })(AdminForm);

export default SquadForm;