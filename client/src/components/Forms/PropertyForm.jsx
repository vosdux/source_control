import React, { Component } from 'react';
import { Form, Icon, Input, Button, Upload, message, Select, Checkbox } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { getAccessToken } from '../../helpers/Utils';
import axios from 'axios';

class PForm extends Component {
    state = {
        loading: false,
        ranks: {
            data: [],
            fetching: true
        },
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { properties, squadId, stationId, peopleId } = this.props;
                let result = [];
                for (let value in values) {
                    if (values[value]) {
                        let res = properties.find(item => item.fieldName === value)
                        result.push(res._id);

                    }
                }
                console.log(result);
                // axios({
                //     method: 'put',
                //     url: `http://localhost:5000/api/squad/${squadId}/${stationId}/${peopleId}`,
                //     data: {
                //         result,
                //     },
                //     headers: { "Authorization": `Bearer ${getAccessToken()}` }
                // })
                //     .then(response => {
                //         if (response.status === 200) {
                //             const { data } = response;
                //             console.log(data)
                //             if (data) {
                //                 this.props.setData(data.squads);
                //             }
                //         } else {
                //             console.log(response);
                //         }
                //     })
                //     .catch(error => {
                //         if (error.response !== undefined) {
                //             errorModalCreate(error.response.data.message);
                //         } else {
                //             errorModalCreate(error);
                //         }
                //     });
                this.props.closeModal();
            }
        });
    };

    render() {
        const { properties, form: { getFieldDecorator } } = this.props
        return (
            <Form onSubmit={this.handleSubmit} className="property-form">
                <h1>Выдать имущество</h1>
                {properties.map(item => <Form.Item key={item.fieldName}>
                    {getFieldDecorator(item.fieldName, {})(
                        <Checkbox>
                            {item.name}
                        </Checkbox>,
                    )}
                </Form.Item>)}


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const PropertyForm = Form.create({ name: 'squad_form' })(PForm);

export default PropertyForm;
