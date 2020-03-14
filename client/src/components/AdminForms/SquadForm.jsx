import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { getAccessToken, refreshToken } from '../../helpers/Utils';
import axios from 'axios';

class AdminForm extends Component {

    saveData = async (values) => {
        try {
            const { mode, editbleData, getItems } = this.props;
            await refreshToken();
            const response = await axios({
                method: mode === 'create' ? 'post' : 'put',
                url: `http://localhost:5000/api/squad/${mode === 'create' ? '' : editbleData._id}`,
                data: values,
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })
            if (response.status === 200) {
                getItems();
            }
        } catch (error) {
            errorModalCreate(error.response.data.message);
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.saveData(values)
                this.props.closeModal();
            }
        });
    };

    render() {
        const { mode, editbleData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="squad-form">
                <h1>Создание отряда</h1>
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Введите название отряда' }],
                        initialValue: mode === 'edit' ? editbleData.name : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Название отряда"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        {mode === 'create' ? 'Создать' : 'Обновить'}
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const SquadForm = Form.create({ name: 'squad_form' })(AdminForm);

export default SquadForm;
