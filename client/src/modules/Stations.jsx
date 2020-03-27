import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getRole } from '../helpers/Utils';
import { connect } from 'react-redux';
import StationForm from '../components/AdminForms/StationForm';
import List from '../components/List';

class Stations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'Наименование',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record) => <Link to={`/squads/${this.props.location.pathname.split('/')[2]}/${record._id}`} >{text}</Link>
                },
                {
                    title: 'Город',
                    dataIndex: 'place',
                    key: 'place',
                },
            ],
            permissons: {
                add: false,
                edit: false,
                delete: false
            }
        };
    };

    componentDidMount() {
        this.getPermissions();
    };

    getPermissions = () => {
        const { role } = this.props;
        const roleName = getRole(role);
        if (roleName === 'admin') {
            this.setState({
                permissons: {
                    add: true,
                    edit: true,
                    delete: true
                }
            });
        }
    };

    AddForm = (props) => (
        <StationForm
            {...props}
        />
    );

    render() {
        const { columns, permissons } = this.state;
        const squadId = this.props.location.pathname.split('/')[2];
        return (
            <List
                title='Пожарные части'
                dataUrl={`api/squad/${squadId}/`}
                AddForm={this.AddForm}
                columns={columns}
                permissons={permissons}
                squadId={squadId}
                statistic={true}
            />
        );
    };
};

const mapStateToProps = (state) => {
    const { role } = state;
    return { role };
};

export default connect(mapStateToProps)(Stations);
