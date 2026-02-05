import { useState, type JSX } from 'react';
import './index.scss';
import instance from '../../utils/request';
import { useNavigate } from 'react-router-dom';
import service from '../../service';
import { setAuthData } from '../../utils/auth';
import type { LoginResult } from '../../shared/types/auth';
export default function Auth(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();
    let labels = {
        title: '注册',
        submit: '注册',
        switchHint: '已有账号？',
        switchAction: '立即登录',
    };
    if (isLoginMode) {
        labels = {
            title: '登录',
            submit: '登录',
            switchHint: '还没有账号？',
            switchAction: '立即注册',
        };
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (isLoginMode) {
                const response = await instance.post<LoginResult>(service.Login, { username, password });
                console.log('登录成功:', response);
                if (response.success) {
                    setAuthData(response.result.access_token, response.result.user);
                    navigate('/chat');
                }
            } else {
                const response = await instance.post<null>(service.Register, { username, password, email });
                console.log('注册成功:', response);
                if (response.success) {
                    handleModeSwitch();
                }
            }
        } catch (err) {
            console.error('请求错误:', err);
        }
    };

    const handleModeSwitch = <T extends React.MouseEvent<HTMLAnchorElement> | undefined>(e?: T) => {
        if (e) {
            e.preventDefault();
        }
        setIsLoginMode(!isLoginMode);
        setUsername('');
        setPassword('');
        if (!isLoginMode) {
            setEmail('');
        }
    };
    return (
        <div className="login-container">
            <div className="login-bg"></div>
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>{labels.title}</h2>
                {!isLoginMode && (
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="请输入邮箱"
                        />
                    </div>
                )}
                <div className="form-group">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="请输入用户名"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="请输入密码"
                    />
                </div>
                <button type="submit" className="submit-button">
                    {labels.submit}
                </button>
                <p className="switch-link">
                    {labels.switchHint}
                    <a href="#" onClick={handleModeSwitch}>
                        {labels.switchAction}
                    </a>
                </p>
            </form>
        </div>
    );
}
