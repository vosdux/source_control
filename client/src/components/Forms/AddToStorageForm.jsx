import React, { Component } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { http } from '../../helpers/Utils';

class AddForm extends Component {
    state = {};

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
                this.props.onCancel();
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { mode, onCancel, editibleData } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('count', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                    })(
                        <InputNumber min={0} max={editibleData && editibleData.count} placeholder='Количество' onChange={this.handleInputChage} />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('size', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'discard' ? editibleData.size : null
                    })(
                        <Input disabled={mode === 'discard'} placeholder='Размер' />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="mr-10px login-form-button">{mode === 'add' ? 'Добавить' : 'Списать'}</Button>
                    <Button type="danger" onClick={onCancel}>Отмена</Button>
                </Form.Item>
            </Form>
        );
    }
}

const AddToStorageForm = Form.create({ name: 'add_to_storage_form' })(AddForm);

export default AddToStorageForm;
