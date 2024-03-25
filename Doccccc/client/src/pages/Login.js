import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import '../styles/RegisterStyle.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/login", values);
            dispatch(hideLoading());

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                message.success('Logged in successfully');
                navigate("/");
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
            message.error('Something went wrong');
        }
    };

    return (
        <div className='form-container'>
            <Form layout='vertical' onFinish={onFinishHandler} className="register-form">
                <h3>Login Form</h3>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
                    <Input type="email" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' className='btn'>
                        Login
                    </Button>
                </Form.Item>
                <div className='link'>
                    <span>Not a user? </span>
                    <Link to="/register">Register here</Link>
                </div>
            </Form>
        </div>
    );
};

export default Login;
