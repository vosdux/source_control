import React, { Component } from 'react';
import { Form, Icon, Input, Button, Row, Col, Card } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import { errorModalCreate } from '../../helpers/Modals';
import * as actions from '../../store/actions';

class NormalLoginForm extends Component {
    state = {
        loading: false
    };

    auth = async (values) => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_BASE}api/auth/login`,
                method: 'post',
                data: values
            });
            if (response.status === 200) {
                const { data } = response;
                console.log(data)
                if (data) {
                    this.loginHandler(data.accessToken, data.refreshToken, data.role, data.expiredIn)
                }
            }
            
        } catch (error) {
            if (error.response) {
                this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
            } else {
                this.setState({ loading: false }, () => errorModalCreate(error.message));
            }
            
        }
    }

    loginHandler = (accessToken, refreshToken, role, expiredIn) => {
        localStorage.setItem('userData', JSON.stringify({
            accessToken,
            refreshToken,
            role,
            expiredIn
        }));
        this.props.userLoginAction(true, role);
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.auth(values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;
        console.log(this.props)
        return (
            <Row type="flex" justify="center" align="top" className="h-100">
                <Col span={6}>
                    <Card title="Вход в систему" className="mt-2">
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your Password!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                                    Войти
                            </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        );
    }
}

const mapDispatchToProps = {
    userLoginAction: actions.userLoginAction
};

const withNormalLoginForm = connect(null, mapDispatchToProps)(NormalLoginForm);
const Auth = Form.create({ name: 'normal_login' })(withNormalLoginForm);

export default Auth;