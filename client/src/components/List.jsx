import React, { Component } from 'react';
import { http } from '../helpers/Utils';
import { Table, Button, Modal, Icon, Layout, Tabs, Input } from 'antd';
import StatisticModule from './Statistic';
import { errorModalCreate } from '../helpers/Modals';

class List extends Component {
    state = {
        data: [],
        loading: true,
        modalVisible: false,
        mode: 'create',
        editbleData: {},
        search: '',
        page: 0,
        size: 10
    }

    componentDidMount() {
        this.getData();
        this.getColumns();
    };

    componentDidUpdate(prevProps) {
        if (prevProps.permissons !== this.props.permissons) {
            this.getColumns();
        }
    }

    getData = async () => {
        try {
            const { dataUrl, enableSearch, formatDataRules } = this.props;
            const { page, size, search } = this.state
            const pageParam = `?page=${page}`;
            const sizeParam = `&size=${size}`;
            const searchParam = `&search=${search}`;
            const response = await http(dataUrl + pageParam + sizeParam + (enableSearch ? searchParam : ''));
            if (response.status === 200) {
                if (response.data) {
                    const { data } = response;
                    this.setState({ data: data.content, loading: false }, () => {
                        if (formatDataRules) {
                            this.formatData();
                        }
                    });
                }
            }
        } catch (error) {
            if (error.response) {
                this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
            } else {
                this.setState({ loading: false }, () => errorModalCreate(error.message));
            }
        }
    };

    deleteItem = async (id) => {
        try {
            const { dataUrl } = this.props;
            const response = await http(dataUrl + id, 'delete'); 
            if (response.status === 200) {
                this.getData();
            }
        } catch (error) {
            errorModalCreate(error.response.data.message)
        }
    };

    formatData = () => {
        const { formatDataRules } = this.props;
        const { data } = this.state;
        let newData = formatDataRules(data);
        this.setState({ data: newData });
    }

    openModal = (mode) => {
        this.setState({ mode, modalVisible: true });
    };

    closeModal = () => {
        this.setState({ modalVisible: false });
    };

    handleSearchChange = (value) => {
        this.setState({ search: value }, () => this.getData());
    }

    getColumns = () => {
        const { permissons, columns } = this.props;
        let newColumns = columns;
        if (permissons.edit) {
            newColumns.push({
                title: '',
                key: 'edit',
                render: (text, record) => <Icon type="edit" onClick={() => { this.openModal('edit'); this.setState({ editbleData: record }) }} />
            })
        }
        if (permissons.delete) {
            newColumns.push({
                title: '',
                key: 'delete',
                render: (text, record) => <Icon type="delete" onClick={() => this.deleteItem(record._id)} />
            })
        }

        this.setState({ columns: newColumns });
    };

    renderList = () => {
        const { data, loading, modalVisible, mode, editbleData, columns } = this.state;
        const { title, AddForm, squadId, permissons, enableSearch, stationId } = this.props;
        return (
            <>
                <h1>{title}</h1>
                {enableSearch && <Input.Search
                    className='mt-1 mb-1'
                    enterButton='Искать'
                    placeholder='Введите фамилию'
                    size='large'
                    onSearch={value => this.handleSearchChange(value)}
                />}
                {permissons.add && <Button type='primary' icon="plus" onClick={() => this.openModal('create')}>Добавить</Button>}
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record._id}
                />
                {permissons.add && <Modal
                    visible={modalVisible}
                    onCancel={this.closeModal}
                    footer={false}
                    destroyOnClose={true}
                >
                    <AddForm
                        getItems={this.getData}
                        closeModal={this.closeModal}
                        mode={mode}
                        editbleData={editbleData}
                        squadId={squadId}
                        stationId={stationId}
                    />
                </Modal>}
            </>
        )
    }

    render() {
        const { squadId, statistic } = this.props;
        const { Content } = Layout;
        const { TabPane } = Tabs;
        return (
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                {statistic ? <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={
                            <span>
                                <Icon type="profile" />
                                Список
                            </span>
                        }
                        key="1"
                    >
                        {this.renderList()}
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <Icon type="solution" />
                                Статистика
                                </span>
                        }
                        key="2"
                    >
                        <StatisticModule
                            squadId={squadId}
                        />
                    </TabPane>
                </Tabs> : this.renderList()}
            </Content>
        );
    };
};

export default List;
