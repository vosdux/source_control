import React, { Component } from 'react';
import { Tabs, Layout, Table, Select, Icon, Button, Modal, Input } from 'antd';
import AddPropertToNorm from './Forms/AddPropertToNorm';
import { http } from '../helpers/Utils';
import { errorModalCreate } from '../helpers/Modals';

class Norms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            columns: [
                {
                    title: 'Наименование',
                    dataIndex: 'property.name'
                },
                {
                    title: 'Количество',
                    dataIndex: 'count'
                },
                {
                    title: '',
                    key: 'edit',
                    render: (text, record, index) => <Icon type="edit" onClick={() => this.openEditModal(index)} />
                },
                {
                    title: '',
                    key: 'delete',
                    render: (text, record, index) => <Icon type="delete" onClick={() => this.deleteItem(index)} />
                }
            ],
            activeKey: 0,
            page: 0,
            edited: false,
            editModalVisible: false,
            addModalVisible: false,
            sex: [
                { value: 'male', label: 'Мужчина' },
                { value: 'female', label: 'Женщина' }
            ]
        }
    }

    componentDidMount() {
        this.getNorms();
        this.getRanks();
    }

    getNorms = async () => {
        try {
            const response = await http('api/norm/');
            if (response.status === 200) {
                if (response.data) {
                    const { data } = response;
                    this.setState({ loading: false, data: data.content });
                }
            }
        } catch (error) {
            this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
        }
    };

    editNorms = async () => {
        try {
            const { activeKey, data } = this.state;
            const response = await http(`api/norm/${data[activeKey]._id}`, 'put', data[activeKey]);
            if (response.status === 200) {
                this.getNorms();
            }
        } catch (error) {
            this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
        }
    };

    deleteNorm = async () => {
        try {
            const { activeKey, data } = this.state;
            const response = await http(`api/norm/${data[activeKey]._id}`, 'delete');
            if (response.status === 200) {
                this.setState({ loading: true }, () => this.getNorms());
            }
        } catch (error) {
            this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
        }
    };

    createNorm = async (values) => {
        try {
            const response = await http(`api/norm/`, 'post', values);
            if (response.data) {
                this.setState({ loading: true }, () => this.getNorms());
            }
        } catch (error) {
            this.setState({ loading: false }, () => errorModalCreate(error.response.data.message));
        }
    }

    getRanks = async () => {
        try {
            const response = await http('api/rank/');
            if (response.status === 200) {
                if (response.data) {
                    const { data } = response;
                    this.setState({ loading: false, ranks: data.content });
                }
            }
        } catch (error) {
            this.setState({ loading: false }, () => errorModalCreate(error.response.data.message))
        }
    };

    onTabChange = (key) => {
        this.setState({ activeKey: key });
    };

    deleteItem = (index) => {
        const { data, activeKey, page } = this.state;
        let editedItem = index;
        let newData = data;
        if (page > 0) {
            editedItem = (page * 10) + index
        }
        newData[activeKey].properties.splice(editedItem, 1);
        this.setState({ data: newData, edited: true }, () => console.log(this.state.data));
    };

    openEditModal = (index) => {
        const { page } = this.state;
        let editedItem = index;
        if (page > 0) {
            editedItem = (page * 10) + index
        }
        this.setState({ editModalVisible: true, editedItem, edited: true });
    };

    openAddModal = (modalMode) => {
        this.setState({ addModalVisible: true, modalMode });
    };

    handleSelectChange = (values, name) => {
        const { activeKey, data } = this.state;
        let newData = data;
        newData[activeKey][name] = values;
        this.setState({ data: newData, edited: true });
    };

    handleInputChange = (e) => {
        const { activeKey, editedItem, data } = this.state;
        const newData = data;
        newData[activeKey].properties[editedItem].count = e.target.value;
        this.setState({ changedCount: newData });
    };

    onModalOk = () => {
        const { changedCount } = this.state;
        this.setState({ data: changedCount, edited: true })
    };

    onTableChange = (pagination) => {
        this.setState({ page: --pagination.current })
    };

    addProperty = (values) => {
        const { activeKey, data } = this.state;
        let newData = data;
        if (newData[activeKey].properties) {
            newData[activeKey].properties.push(values);
        } else {
            newData[activeKey].properties = [values];
        }
        this.setState({ data: newData, loading: true }, () => this.editNorms());
    };

    render() {
        const { data, columns, loading, ranks, edited, editModalVisible, activeKey, editedItem, addModalVisible, modalMode, sex } = this.state;
        const { TabPane } = Tabs;
        const { Content } = Layout;
        let options = [];
        if (ranks) {
            options = ranks.map((item, index) => <Select.Option value={item._id} key={index}>{item.name}</Select.Option>)
        }
        const sexOptions = sex.map(item => <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>)
        return (
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <Button type='primary' onClick={() => this.openAddModal('addNorm')}>Добавить норму</Button>
                <Tabs activeKey={`${activeKey}`} className='mt-2' tabPosition='left' onChange={this.onTabChange}>
                    {data && data.map((item, index) => <TabPane tab={item.name} key={index}>
                        <Button type='primary' onClick={() => this.openAddModal('addProp')} className='mr-10px'>Добавить</Button>
                        <Button type='danger' onClick={this.deleteNorm}>Удалить норму</Button>
                        <Table
                            className='mt-2'
                            rowKey={(record) => record.property._id}
                            loading={loading}
                            columns={columns}
                            dataSource={item.properties}
                            onChange={this.onTableChange}
                        />
                        <div className='d-flex'>
                            <Select
                                placeholder='Пол'
                                defaultValue={item.sex}
                                className='mr-10px'
                                onChange={(value) => this.handleSelectChange(value, 'sex')}
                            >
                                {sexOptions}
                            </Select>
                            <Select
                                className='mt-2'
                                mode='multiple'
                                maxTagCount={1}
                                maxTagPlaceholder={'...'}
                                style={{ width: '300px' }}
                                showArrow
                                placeholder='Выбирите звания'
                                onChange={(value) => this.handleSelectChange(value, 'owners')}
                                defaultValue={item.owners}
                            >
                                {options}
                            </Select>
                        </div>
                        <div className='d-flex mt-2'>
                            <Button type='primary' disabled={!edited} onClick={this.editNorms}>Сохранить изменения</Button>
                        </div>
                    </TabPane>
                    )}
                </Tabs>
                <Modal
                    title='Изменить количество'
                    visible={editModalVisible}
                    onOk={this.onModalOk}
                    onCancel={() => this.setState({ editModalVisible: false })}
                >
                    <Input
                        placeholder='Введите количество'
                        defaultValue={editModalVisible && data[activeKey].properties[editedItem].count}
                        onChange={(e) => this.handleInputChange(e)}
                    />
                </Modal>
                <Modal
                    title={modalMode === 'addProp' ? 'Добавить имущество' : 'Добавить норму'}
                    visible={addModalVisible}
                    onCancel={() => this.setState({ addModalVisible: false })}
                    footer={false}
                    destroyOnClose
                >
                    {<AddPropertToNorm
                        onSubmit={modalMode === 'addProp' ? this.addProperty : this.createNorm}
                        onCancel={() => this.setState({ addModalVisible: false })}
                        modalMode={modalMode}
                    />}
                </Modal>
            </Content>
        );
    };
};

export default Norms;
