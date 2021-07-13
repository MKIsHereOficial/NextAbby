
import React from 'react';

import Head from 'next/head';

import styled from 'styled-components';

import textVars from '../config/textVars.config';
import styles from '../styles/Login.module.scss';

import { useSession } from 'next-auth/client'

const HomePage: React.FC = () => {
    var [session, loading] = useSession();

    console.dir(loading);
    console.dir(session);
    
    if (session && session['user'] && session['user']['id']) return <h1>MongoDB</h1>;

    if (loading) return (
        <div className={styles.body}>
            <Head>
                <title>Carregando...</title>
            </Head>
        
            <main style={{position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <h1>Carregando...</h1>
            </main>
        </div>
    );

    return (
        <div className={styles.body}>
            <Head>
                <title>Login - AbbyCastle</title>
            </Head>
            <main className={styles.main}>

                <p className={styles.paragraph}>{textVars.LOGIN_ADVICE}</p>

                
                <a href="/api/auth/signin">
                    <button className={styles.login_btn}>Logue-me</button>
                </a>
            </main>
        </div>
    )
}


export default HomePage;
