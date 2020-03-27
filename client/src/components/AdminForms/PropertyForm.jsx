import React, { Component } from 'react';
import { Form, Icon, Input, Button, InputNumber } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { http } from '../../helpers/Utils';

class AdminForm extends Component {

    saveData = async (values) => {
        try {
            const { mode, editbleData, getItems } = this.props;
            const method = mode === 'create' ? 'post' : 'put';
            const response = await http(`api/property/${mode === 'create' ? '' : editbleData._id}`, method, values);
            if (response.status === 200) {
                getItems();
            }
        } catch (error) {
            if (error.response) {
                this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
            } else {
                this.setState({ loading: false }, () => errorModalCreate(error.message));
            }
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.saveData(values);
                this.props.closeModal(values);
            }
        });
    };

    render() {
        const { mode, editbleData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="squad-form">
                <h1>Имущество</h1>
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.name : ''
                    })(
                        <Input placeholder="Название" />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('fieldName', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.fieldName : ''
                    })(
                        <Input placeholder="Англ. название" />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('lifeTime', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.lifeTime : ''
                    })(
                        <InputNumber style={{ width: '100%' }} placeholder="Срок службы в годах" />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        {mode === 'create' ? 'Создать' : 'Обновить'}
                    </Button>
                </Form.Item>
            </Form>
        );
    };
};

const PropertyForm = Form.create({ name: 'property_form' })(AdminForm);

export default PropertyForm;
