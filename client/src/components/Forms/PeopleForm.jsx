import React, { Component } from 'react';
import { Form, Icon, Input, Button, Upload, Select } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { http } from '../../helpers/Utils';

class AdminForm extends Component {
    state = {
        loading: false,
        ranks: {
            data: [],
            fetching: true
        },
        sex: [
            { value: 'male', label: 'Мужчина' },
            { value: 'female', label: 'Женщина' }
        ]
    };

    componentDidMount() {
        this.getRanks();
    };

    getRanks = async () => {
        try {
            const response = await http(`api/rank/`);
            if (response.status === 200) {
                const { data } = response;
                if (data) {
                    this.setState({
                        ranks: {
                            data: data.ranks,
                            fetching: false
                        }
                    });
                }
            }
        } catch (error) {
            errorModalCreate(error.message)
        }
    };

    getBase64(img) {
        const isJpgOrPng = img.type === 'image/jpeg' || img.type === 'image/png';
        if (!isJpgOrPng) {
            errorModalCreate('Вы можете загружать только файлы форматов JPG/PNG!');
            return false;
        }
        const isLt2M = img.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            errorModalCreate('Файл должен быть меньше 2МБ!');
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

    createUserCard = async (values) => {
        try {
            const { mode, editbleData, squadId, stationId, getItems } = this.props;
            const { imageUrl } = this.state;
            const method = mode === 'create' ? 'post' : 'put';
            const data = {
                ...values,
                upload: imageUrl,
                station: stationId
            }
            const response = await http(`api/squad/${squadId}/${stationId}/${mode === 'create' ? '' : editbleData._id}`, method, data);
            if (response.status === 200) {
                getItems();
            }
        } catch (error) {
            errorModalCreate(error.response.data.message);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.createUserCard(values);
                this.props.closeModal();
            }
        });
    };

    handleChange = (info) => {
        this.setState({ loading: true })
        this.getBase64(info.file);
    };

    render() {
        const { mode, editbleData } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { imageUrl, loading, ranks: { data, fetching }, sex } = this.state;
        let rankObj = {
            rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
        };
        let sexObj = {
            rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
        };
        if (mode === 'edit') {
            rankObj.initialValue = editbleData.rank._id;
            sexObj.initialValue = editbleData.sex
        }
        let options = [];
        if (data !== undefined) {
            options = data.map(item => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)
        }

        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Загрузить</div>
            </div>
        );
        const sexOptions = sex.map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>);
        return (
            <Form onSubmit={this.handleSubmit} className="squad-form">
                <h1>{mode === 'edit' ? 'Редактирование карточки сотрудника' : 'Создание карточки сотрудника'}</h1>
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
                    {getFieldDecorator('midleName', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.midleName : ''
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Отчество"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('sex', sexObj)(
                        <Select
                            placeholder="Выберите пол"
                            loading={fetching}
                        >
                            {sexOptions}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('idcard', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.idcard : ''
                    })(
                        <Input
                            prefix={<Icon type="number" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Номер удостоверения"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('rank', rankObj)(
                        <Select
                            placeholder="Выберите звание"
                            loading={fetching}
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
                            prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Должность"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('height', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.hieght : ''
                    })(
                        <Input
                            prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Рост"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('weight', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.weight : ''
                    })(
                        <Input
                            prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Вес"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('size', {
                        rules: [{ required: true, message: 'Поле обязательно для заполнения' }],
                        initialValue: mode === 'edit' ? editbleData.size : ''
                    })(
                        <Input
                            prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Размер"
                        />,
                    )}
                </Form.Item>
                <Form.Item label="Аватар">
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
