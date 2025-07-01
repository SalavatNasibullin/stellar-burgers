import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { login, setLoginSuccess } from '../../services/slices/user-slice';
import { setCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

// Тип формы входа
type LoginForm = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  // Состояние для формы
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.auth.loading);

  // Обработка отправки формы
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Отправка запроса на вход
    dispatch(login({ email, password }))
      .unwrap()
      .then((response) => {
        // Сохранение токенов
        localStorage.setItem('refreshToken', response.refreshToken);
        setCookie('accessToken', response.accessToken);
        dispatch(setLoginSuccess(true));
        navigate('/');
      })
      .catch((error) => {
        console.error('Ошибка входа:', error);
      });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={(e) => setEmail(e.target.value)}
      password={password}
      setPassword={(e) => setPassword(e.target.value)}
      handleSubmit={handleFormSubmit}
    />
  );
};
