import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getRole } from '../helpers/Utils';
import { connect } from 'react-redux';
import SquadForm from '../components/AdminForms/SquadForm';
import List from '../components/List';

class Squads extends Component {
    state = {
        columns: [
            {
                title: 'Наименование',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Link to={`/${record._id}`} >{text}</Link>
            }
        ],
        permissons: {
            add: false,
            edit: false,
            delete: false
        }
    };

    componentDidMount() {
        this.getPermissions();
    }

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
        <SquadForm
            {...props}
        />
    );

    render() {
        const { columns, permissons } = this.state;
        return (
            <List
                title='Отряды ФПС МЧС России по Московской области'
                dataUrl='http://localhost:5000/api/squad/'
                AddForm={this.AddForm}
                columns={columns}
                permissons={permissons}
                statistic={false}
            />
        );
    };
};


const mapStateToProps = (state) => {
    const { role } = state;
    return { role };
};

export default connect(mapStateToProps)(Squads);
