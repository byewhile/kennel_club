"use client"

import axios from "axios";
import { useState } from "react";
import { FaPaw } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import CaptchaBlock from "./CaptchaBlock";
import ErrorBlock from "./ErrorBlock";

export default function RegisterForm({ sendEmail, setSendEmail }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("captcha", captcha);
        formData.append("action", "register");

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register.php`, formData, {
                withCredentials: true
            });
            const data = res.data;

            if (data.isLogin) {
                setSendEmail(true);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Не удалось подключиться к серверу!");
        }
        setCaptcha("");
    }

    const handleEmailFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("code", code);
        formData.append("action", "verify");

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register.php`, formData, {
                withCredentials: true
            });
            const data = res.data;

            if (data.isLogin) {
                window.location.reload();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Не удалось подключиться к серверу!");
        }
        setCode("");    
    }

    return (
        <form className="w-full lg:w-auto lg:min-w-md mx-auto mt-32 lg:mt-16 p-4 lg:p-8 text-green rounded-lg shadow-lg" onSubmit={sendEmail ? handleEmailFormSubmit : handleSubmit}>
            {sendEmail ? (
                <div className="flex flex-col items-center text-center gap-5">
                    <FiMail className="text-4xl" />
                    <h2 className="text-2xl font-bold">Введите код подтверждения</h2>
                    <div className="w-auto lg:w-100">Мы отправили одноразовый код подтверждения на указанный адрес электронной почты <span className="font-semibold">({email})</span>, пожалуйста, введите его ниже</div>

                    <input
                        type="text" 
                        placeholder="Код подтверждения" 
                        value={code}
                        minLength={6}
                        maxLength={6}
                        onChange={(e) => setCode(e.target.value)}
                        className={`w-full font-medium px-4 py-2 border ${error ? "border-red-500" : "border-green"} rounded-lg outline-none placeholder-green text-center`}
                        required
                    />

                    <input 
                        type="submit"
                        value="Отправить"
                        className="w-full bg-lim text-white bg-green font-bold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
                    />

                    <div className="w-auto lg:w-100 text-sm">Нажимая кнопку «Отправить», вы подтверждаете своё согласие на получение рекламных рассылок</div>
                    {error && <ErrorBlock error={error} />}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-5">
                    <FaPaw className="text-4xl" />
                    <h2 className="text-2xl font-bold">Регистрация</h2>
            
                    <div className="flex flex-col lg:flex-row w-full gap-6">
                        <input 
                            type="text" 
                            placeholder="Имя"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            className={`font-medium px-4 py-2 border ${error == "Заполните все поля!" ? "border-red-500" : "border-green"} rounded-lg outline-none placeholder-green`}
                            required
                        />
                
                        <input 
                            type="text" 
                            placeholder="Фамилия" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            className={`font-medium px-4 py-2 border ${error == "Заполните все поля!" ? "border-red-500" : "border-green"} rounded-lg outline-none placeholder-green`}
                            required
                        />
                    </div>

                    <input 
                        type="email" 
                        placeholder="Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full font-medium px-4 py-2 border ${(error == "Некорректный email!" || error == "Email уже используется!" || error == "Заполните все поля!") ? "border-red-500" : "border-green"} rounded-lg outline-none placeholder-green`}
                        required
                    />

                    <div className={`flex items-center w-full font-medium px-4 py-2 border ${error == "Заполните все поля!" ? "border-red-500" : "border-green"} rounded-lg`}>
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Пароль"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full outline-none placeholder-green"
                            required
                        />

                        {showPassword ? (
                            <FaEyeSlash className="text-xl cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                            <FaEye className="text-xl cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                        )}
                    </div>
            
                    <div className="flex flex-col justify-between lg:flex-row w-full gap-6">
                        <CaptchaBlock />

                        <input 
                            type="text" 
                            placeholder="Код с картинки"
                            value={captcha}
                            minLength={6}
                            maxLength={6}
                            onChange={(e) => setCaptcha(e.target.value)}
                            className={`font-medium px-4 py-2 border ${(error == "Неправильный код с картинки!" || error == "Заполните все поля!") ? "border-red-500" : "border-green"} rounded-lg outline-none placeholder-green`}
                            required
                        />
                </div>

                <input 
                    type="submit" 
                    value="Зарегистрироваться" 
                    className="w-full bg-lim text-white bg-green font-bold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
                />
                {error && <ErrorBlock error={error} />}
            </div>
            )}
        </form>
    );
}