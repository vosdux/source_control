import React, { Component } from 'react';
import { Form, Icon, Input, Button, Upload, message } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { getAccessToken } from '../../helpers/Utils';
import axios from 'axios';

class AdminForm extends Component {
    state = {
        imageUrl: ''
    }

    handleSubmit = e => {
        const { mode, editbleData, squadId, stationId } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            // if (!err) {
            //     console.log(values)
            //     axios({
            //         method: mode === 'create' ? 'post' : 'put',
            //         url: `http://localhost:5000/api/squad/${squadId}/${stationId}/${mode === 'create' ? '' : editbleData._id}`,
            //         data: values,
            //         headers: { "Authorization": `Bearer ${getAccessToken()}` }
            //     })
            //         .then(response => {
            //             if (response.status === 200) {
            //                 const { data } = response;
            //                 console.log(data)
            //                 if (data) {
            //                     this.props.setData(data.squads);
            //                 }
            //             } else {
            //                 console.log(response);
            //             }
            //         })
            //         .catch(error => {
            //             if (error.response !== undefined) {
            //                 errorModalCreate(error.response.data.message);
            //             } else {
            //                 errorModalCreate(error);
            //             }
            //         });
            //     this.props.closeModal();
            // }
        });
    };

    normFile = e => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    render() {
        const { mode, editbleData } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { imageUrl } = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Form onSubmit={this.handleSubmit} className="squad-form">
                <h1>Создание отряда</h1>
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.name : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Имя"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('secondName', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.secondName : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Фамилия"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('midleName', {
                        initialValue: mode === 'edit' ? editbleData.middleName : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Отчество"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('rank', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.rank : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Звание"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('position', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.position : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Должность"
                        />,
                    )}
                </Form.Item>
                <Form.Item label="Upload" extra="longgggggggggggggggggggggggggggggggggg">
                    {getFieldDecorator('upload', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                    })(
                        <Upload name="logo" action="http://localhost:5000/api/squad/${squadId}/${stationId}/" listType="picture">
                            <Button>
                                <Icon type="upload" /> Click to upload
                            </Button>
                        </Upload>,
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

const PeopleForm = Form.create({ name: 'squad_form' })(AdminForm);

export default PeopleForm;
