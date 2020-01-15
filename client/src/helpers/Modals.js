import { Modal } from 'antd';

export function errorModalCreate(text) {
    Modal.error({
        title: 'Ошибка',
        content: text,
    });
};

export function successModalCreate(text) {
    Modal.success({
        title: 'Успех',
        content: text,
    });
};


