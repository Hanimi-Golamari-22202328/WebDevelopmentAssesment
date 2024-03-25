import React, { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import '../styles/RegisterStyle.css';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false); // State to track if the illustration and form are loaded

    useEffect(() => {
        // Set a timeout to simulate loading the illustration and form
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 1000);

        // Cleanup function
        return () => clearTimeout(timer);
    }, []);

    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/register", values);
            dispatch(hideLoading());
            if (res.data.success) {
                message.success('Registered Successfully!');
                navigate('/login');
            } else {
                dispatch(hideLoading());
                message.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            message.error('Something went wrong');
        }
    };

    return (
        <div className='form-container'>
           
            <div className={`form-content ${isLoaded ? 'loaded' : ''}`}>
                <Form layout='vertical' onFinish={onFinishHandler} className="register-form">
                    <h3 className='text-center'>Register Form</h3>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name' }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email' }]}>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password' }]}>
                        <Input type="password" />
                    </Form.Item>
                    <Form.Item>
                        <Link to="/login" className='m-2'>Already have an account? Login here</Link>
                    </Form.Item>
                    <Form.Item>
                        <button className='btn btn-primary' type='submit'>Register</button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;
