import React, { Component } from 'react';
import { Form, Icon, Input, Button, Upload, message, Select } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { getAccessToken } from '../../helpers/Utils';
import axios from 'axios';

class AdminForm extends Component {
    state = {
        loading: false,
        ranks: {
            data: [],
            fetching: true
        },
    };

    componentDidMount() {
        this.getRanks();
    }

    getRanks = () => {
        axios({
            method: 'get',
            url: `http://localhost:5000/api/rank/`,
            headers: { "Authorization": `Bearer ${getAccessToken()}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const { data } = response;
                    if (data) {
                        console.log(data)
                        this.setState({
                            ranks: {
                                data: data.ranks,
                                fetching: false
                            }
                        });
                    } else {
                        console.log(response)
                    }
                }
            })
            .catch((error) => errorModalCreate(error.message));
    }

    getBase64(img) {
        const isJpgOrPng = img.type === 'image/jpeg' || img.type === 'image/png';
        if (!isJpgOrPng) {
            console.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = img.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            console.error('Image must smaller than 2MB!');
            return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (e) => {
            this.setState({
                loading: false,
                imageUrl: e.target.result
            });
        }
    };

    handleSubmit = e => {
        const { mode, editbleData, squadId, stationId } = this.props;
        const { imageUrl, ranks } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios({
                    method: mode === 'create' ? 'post' : 'put',
                    url: `http://localhost:5000/api/squad/${squadId}/${stationId}/${mode === 'create' ? '' : editbleData._id}`,
                    data: {
                        ...values,
                        upload: imageUrl,
                        station: stationId
                    },
                    headers: { "Authorization": `Bearer ${getAccessToken()}` }
                })
                    .then(response => {
                        if (response.status === 200) {
                            const { data } = response;
                            console.log(data)
                            if (data) {
                                this.props.getPeoples();
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
                    });
                this.props.closeModal();
            }
        });
    };

    handleChange = info => {
        this.setState({loading: true})
        this.getBase64(info.file);
    };



    render() {
        const { mode, editbleData } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { imageUrl, loading, ranks: { data, fetching } } = this.state;
        let options = [];
        if (data !== undefined) {
            options = data.map(item => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)
        }

        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
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
                        <Select
                            loading={fetching}
                            placeholder="Выбирите звание"
                        >
                            {options}
                        </Select>
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
                <Form.Item label="Upload">
                    {getFieldDecorator('upload', {})(
                        <div className="clearfix">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                        </div>,
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
