// src/pages/oauth2/redirect.tsx

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OAuth2Redirect = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            localStorage.setItem('token', token) // トークンを保存
            setTimeout(() => {
                navigate('/home') // ログイン後の画面へ遷移
            }, 1000)

        } else {
            // トークンがない場合はログイン画面に戻す
            navigate('/login')
        }
    }, [navigate])

    return <p>ログイン処理中です...</p>
}

export default OAuth2Redirect