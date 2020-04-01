import React, { Component } from 'react';
import { Form, Input, Button, Select, InputNumber } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { http } from '../../helpers/Utils';

class AddForm extends Component {
    state = {
        data: [],
        loading: false
    };

    componentDidMount() {
        this.getPropertyes();
    };

    getPropertyes = async () => {
        try {
            const response = await http('api/property');
            if (response.status === 200) {
                if (response.data) {
                    this.setState({ data: response.data.content, loading: false });
                }
            }
        } catch (error) {
            this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
                this.props.onCancel();
            }
        });
    };

    onSearch = (val) => {
        console.log('search:', val);
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { loading, data } = this.state;
        const { modalMode } = this.props;
        let options;
        if (data) {
            options = data.map((item, index) => <Select.Option key={index} value={item._id}>{item.name}</Select.Option>);
        }
        return (
            <Form onSubmit={this.handleSubmit} className="squad-form">
                {modalMode === 'addProp' ? <>
                    <Form.Item>
                        {getFieldDecorator('property', {
                            rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        })(
                            <Select
                                placeholder="Выбирите имущество"
                                showSearch
                                onSearch={this.onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                loading={loading}
                            >
                                {options}
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('count', {
                            rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        })(
                            <InputNumber
                                min={1}
                                placeholder="Количество"
                            />,
                        )}
                    </Form.Item>
                </> : <Form.Item>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        })(
                            <Input
                                placeholder="Наименование"
                            />,
                        )}
                    </Form.Item>}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const AddPropertToNorm = Form.create({ name: 'add_proeprty_to_norm_form' })(AddForm);

export default AddPropertToNorm;
