import React, { Component } from 'react';
import AddToStorageForm from './Forms/AddToStorageForm';
import { http, getRole } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';
import { Layout, Tabs, Button, Table, Modal } from 'antd';
import { connect } from 'react-redux';

class Storage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            activeKey: 0,
            modalVisible: false,
            data: [],
            columns: [
                {
                    title: 'Размер',
                    dataIndex: 'size',
                    sorter: (a, b) => a.size - b.size
                },
                {
                    title: 'Количество',
                    dataIndex: 'count',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.count - b.count
                },
            ]
        }
    }

    componentDidMount() {
        this.getProperty();
    };

    getProperty = async () => {
        try {
            const response = await http('api/property');
            if (response.status === 200) {
                if (response.data) {
                    const { data } = response;
                    this.setState({ data: data.content }, () => this.getStorage());
                }
            }
        } catch (error) {
            this.setState({ loading: false }, errorModalCreate(error.message));
        }
    };

    getStorage = async () => {
        try {
            const response = await http('api/storage');
            if (response.status === 200) {
                if (response.data) {
                    const { data } = response;
                    this.setState({ storage: data.content, loading: false });
                }
            }
        } catch (error) {
            this.setState({ loading: false }, errorModalCreate(error.message));
        }
    };

    editProperty = async (values) => {
        try {
            const { data, activeKey, mode } = this.state;
            const response = await http('api/storage', 'put', { ...values, id: data[activeKey]._id, mode });
            if (response.status === 200) {
                this.getProperty();
            }
        } catch (error) {
            this.setState({ loading: false }, errorModalCreate(error.message));
        }
    };

    onTabChange = (key) => {
        this.setState({ activeKey: key });
    };

    openModal = (mode, data) => {
        this.setState({
            modalVisible: true,
            mode,
            editibleData: data
        })
    }

    render() {
        const { role } = this.props;
        const { data, storage, activeKey, modalVisible, columns, mode, editibleData } = this.state;
        const { Content } = Layout;
        const { TabPane } = Tabs;
        getRole(role) === 'storage' && columns.push({
            render: (text, record) => <Button onClick={() => this.openModal('discard', record)}>Списать</Button>
        });
        return (
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <Tabs activeKey={`${activeKey}`} tabPosition='left' onChange={this.onTabChange}>
                    {data && data.map((item, index) => {
                        let property;
                        if (storage) {
                            property = storage.find(elem => elem.property === item._id)
                        }
                        return (<TabPane tab={item.name} key={index}>
                            {getRole(role) === 'storage' && <Button type='primary' onClick={() => this.openModal('add')}>Внести имущество</Button>}
                            <Table
                                columns={columns}
                                dataSource={property && property.data}
                                rowKey={record => record.size}
                            />
                        </TabPane>)
                    }
                    )}
                </Tabs>
                <Modal
                    title={data && data[activeKey] && `${mode === 'add' ? 'Добавить' : 'Списать'} "${data[activeKey].name}"`}
                    visible={modalVisible}
                    onCancel={() => this.setState({ modalVisible: false })}
                    footer={null}
                    destroyOnClose={true}
                >
                    <AddToStorageForm
                        mode={mode}
                        editibleData={editibleData}
                        onCancel={() => this.setState({ modalVisible: false })}
                        onSubmit={this.editProperty}
                    />
                </Modal>
            </Content>
        );
    };
};


const mapStateToProps = (state) => {
    const { role } = state;
    return { role };
};

export default connect(mapStateToProps)(Storage);
