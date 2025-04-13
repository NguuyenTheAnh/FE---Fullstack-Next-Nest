'use client';
import { useHasMounted } from '@/utils/customHook';
import { Button, Form, Input, Modal, notification, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';

const ModalReactive = (props: any) => {
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [current, setCurrent] = useState(0);
    const [userId, setUserId] = useState("");

    const [form] = Form.useForm();

    useEffect(() => {
        if (userEmail) {
            form.setFieldsValue({ email: userEmail });
        }
    }, [userEmail]);

    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>

    const onFinishResend = async (values: any) => {
        const { email } = values; // get from form bellow
        const res = await sendRequest<IBackendRes<any>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/resend`,
            body: {
                email
            }
        });
        if (res?.data) {
            setUserId(res?.data?._id);
            setCurrent(1);
        }
        else {
            notification.error({
                message: "Call APIs Error",
                description: res?.message
            })
        }
    }
    const onFinishActive = async (values: any) => {
        const { code } = values; // get from form bellow
        const _id = userId;
        const res = await sendRequest<IBackendRes<any>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,
            body: {
                _id, code
            }
        });

        if (res?.data) {
            setCurrent(2);
        }
        else {
            notification.error({
                message: "Verify error",
                description: res?.message
            })
        }
    };
    return (
        <>
            <Modal title="Kích hoạt tài khoản"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Login',
                            // status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            // status: 'finish',
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: 'Done',
                            // status: 'wait',
                            icon: <SmileOutlined />,
                        },
                    ]}

                />
                {current === 0 &&
                    <>
                        <div style={{ margin: "20px 0px" }}>
                            <p>
                                Tài khoản của bạn chưa được kích hoạt
                            </p>
                        </div>
                        <Form
                            form={form}
                            name="basic"
                            onFinish={onFinishResend}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item
                                label=""
                                name="email"
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Resend
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }
                {current === 1 &&
                    <>
                        <div style={{ margin: "20px 0px" }}>
                            <p>
                                Vui lòng nhập mã xác nhận
                            </p>
                        </div>
                        <Form
                            name="basic1"
                            onFinish={onFinishActive}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your code!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Active
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }
                {current === 2 &&
                    <div style={{ margin: "20px 0px" }}>
                        <p>
                            Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập lại
                        </p>
                    </div>
                }
            </Modal>
        </>
    );
};

export default ModalReactive;