import React, { FC, ChangeEvent, useState, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useAuth } from '../hooks/auth.hook';
import { AuthContext } from '../context/AuthContext';

interface IForm {
    email: string,
    password: string
}

export const Auth: FC = () => {
    const [form, setForm] = useState<IForm>({
        email: '',
        password: ''
    });

    const auth = useContext(AuthContext);
    console.log(auth);

    const { loading, request, error, clearError } = useHttp();

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const loginHandler = async () => {
        try {
            request('http://localhost:5000/api/auth/login', 'POST', {...form});
            auth.login()
        } catch (error) {
            
        }
    }

    return (
        <div className="row align-items-center h-100 justify-content-center bg-blue">
            <div className="card" style={{ width: '400px' }}>
                <div className="card-header text-center">
                    <h1 className="card-title mb-0">Войти</h1>
                </div>
                <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input 
                                type="email"
                                className="form-control"
                                id="exampleInputEmail1"
                                name="email"
                                onChange={changeHandler}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Пароль</label>
                            <input 
                                type="password" className="form-control"
                                id="exampleInputPassword1"
                                name="password"
                                onChange={changeHandler}  
                            />
                        </div>
                        <button className="btn btn-primary mt-3" onClick={loginHandler}>Войти</button>
                </div>
            </div>
        </div>

    );
}