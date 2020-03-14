import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PeopleForm from '../components/Forms/PeopleForm';
import List from '../components/List';

class Peoples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'Имя',
                    dataIndex: 'fullName',
                    render: (text, record) => <Link to={`/${this.props.location.pathname.split('/')[1]}/${this.props.location.pathname.split('/')[2]}/${record._id}`} >{text}</Link>
                },
                {
                    title: 'Звание',
                    dataIndex: 'rank',
                },
                {
                    title: 'Должность',
                    dataIndex: 'position',
                },
            ],
            permissons: {
                add: true,
                edit: true,
                delete: false
            }
        };
    };

    formatPeople = (data) => {
        let newData = data.map(item => ({
            ...item,
            fullName: `${item.secondName} ${item.name} ${item.midleName !== undefined ? item.midleName : ''}`,
        }));
        return newData;
    };

    AddForm = (props) => (
        <PeopleForm
            {...props}
        />
    );

    render() {
        const { columns, permissons } = this.state;
        const squadId = this.props.location.pathname.split('/')[1];
        const stationId = this.props.location.pathname.split('/')[2];
        return (
            <List
                title='Сотрудники'
                dataUrl={`http://localhost:5000/api/squad/${squadId}/${stationId}/`}
                AddForm={this.AddForm}
                columns={columns}
                permissons={permissons}
                squadId={squadId}
                stationId={stationId}
                enableSearch={true}
                statistic={true}
                formatDataRules={this.formatPeople}
            />
        );
    };
};


const mapStateToProps = (state) => {
    const { role } = state;
    return { role };
};

export default connect(mapStateToProps)(Peoples);
