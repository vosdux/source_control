import React, { Component, Fragment } from 'react';
import { Form, Button, Checkbox, DatePicker, Divider, InputNumber } from 'antd';
import { errorModalCreate } from '../../helpers/Modals';
import { http } from '../../helpers/Utils';
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

    giveProperty = async (result) => {
        try {
            const { peopleId, isDocumentModal, getPeopleData } = this.props;
            let url = `api/property/${peopleId}/add-property`;
            let method = 'put';
            if (isDocumentModal) {
                url = `api/document-creator`;
                method = 'get';
            }
            const response = await http(url, method, {result})
            if (response.status === 200) {
                !isDocumentModal && getPeopleData();
            }
        } catch (error) {
            errorModalCreate(error.response.data.message);
        }
    };

    handleSubmit = (e) => {
        const { properties } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let result = [];
                for (let value in values) {
                    if (values[value] && !values[value]._isAMomentObject && typeof values[value] !== 'number') {
                        let property = {};
                        let res = properties.find(item => item.property.fieldName === value);
                        property.property = res && res.property._id;
                        if (values[value + '_date']) {
                            property.date = moment(values[value + '_date']).format('YYYY-MM-DD');
                        };
                        for (let i = 0; i < values[value + '_count']; i++) {
                            result.push(property);
                        }
                    }
                }
                this.giveProperty(result);
                this.props.closeModal();
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
                {properties.map(item => <Fragment key={item.property.fieldName}>
                    <Form.Item>
                        {getFieldDecorator(item.property.fieldName, {})(
                            <Checkbox onChange={(e) => this.handleCheckboxChange(e, item.property.fieldName)}>
                                {item.property.name}
                            </Checkbox>,
                        )}
                    </Form.Item>
                    {checked && checked[item.property.fieldName] && <>
                        <Form.Item>
                            {getFieldDecorator(item.property.fieldName + '_date', {})(
                                <DatePicker
                                    placeholder='Выберите дату'
                                    disabledDate={this.disabledStartDate}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator(item.property.fieldName + '_count', {
                                initialValue: 1
                            })(
                                <InputNumber
                                    placeholder='Количество'
                                    min={1}
                                    max={+item.count}

                                />,
                            )}
                        </Form.Item>
                    </>}
                    <Divider />
                </Fragment>)}


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        );
    };
};

const PropertyForm = Form.create({ name: 'squad_form' })(PForm);

export default PropertyForm;
