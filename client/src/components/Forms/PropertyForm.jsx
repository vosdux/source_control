import React, { Component, Fragment } from 'react';
import { Form, Button, Checkbox, DatePicker, Divider } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { getAccessToken } from '../../helpers/Utils';
import axios from 'axios';
import moment from 'moment';

class PForm extends Component {
    state = {
        loading: false,
        checked: {}
    };

    componentDidMount() {
        const { properties } = this.props;
        let checked = {};
        properties && properties.forEach(item => {
            checked[item.fieldName] = false
        });
        this.setState({ checked });
    };

    componentDidUpdate(prevProps) {
        const { properties } = this.props;
        if (prevProps.properties !== properties) {
            let checked = {};
            properties && properties.forEach(item => {
                checked[item.fieldName] = false
            });
            this.setState({ checked });
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { properties, squadId, stationId, peopleId } = this.props;
                let result = [];
                console.log(values)
                for (let value in values) {
                    if (values[value] && !values[value]._isAMomentObject) {
                        let property = {};
                        let res = properties.find(item => item.fieldName === value);
                        property.property = res && res._id
                        if (values[value + '_date']) {
                            property.date = moment(values[value + '_date']).format('DD-MM-YYYY')
                        };
                        result.push(property);

                    }
                }
                console.log(result);
                axios({
                    method: 'put',
                    url: `http://localhost:5000/api/squad/${squadId}/${stationId}/${peopleId}`,
                    data: {
                        result,
                    },
                    headers: { "Authorization": `Bearer ${getAccessToken()}` }
                })
                    .then(response => {
                        if (response.status === 200) {
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
                this.props.getPeopleData();
            }
        });
    };

    handleCheckboxChange = ({ target }, fieldName) => {
        const { checked } = this.state;
        let newChecked = checked;
        newChecked[fieldName] = target.checked;
        this.setState({ checked: newChecked });
    };

    disabledStartDate = startValue => {
        let now = moment();
        return startValue.valueOf() > now.valueOf();
    };

    render() {
        const { properties, form: { getFieldDecorator } } = this.props;
        const { checked } = this.state;
        return (
            <Form onSubmit={this.handleSubmit} className="property-form">
                <h1>Выдать имущество</h1>
                {properties.map(item => <Fragment key={item.fieldName}>
                    <Form.Item>
                        {getFieldDecorator(item.fieldName, {})(
                            <Checkbox onChange={(e) => this.handleCheckboxChange(e, item.fieldName)}>
                                {item.name}
                            </Checkbox>,
                        )}
                    </Form.Item>
                    {checked && checked[item.fieldName] && <Form.Item>
                        {getFieldDecorator(item.fieldName + '_date', {})(
                            <DatePicker
                                placeholder='Выберите дату'
                                disabledDate={this.disabledStartDate}
                            />,
                        )}
                    </Form.Item>}
                    <Divider />
                </Fragment>)}


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