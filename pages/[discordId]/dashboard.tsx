
import React from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';

import Head from 'next/head';

import styled from 'styled-components';

import styles from '../../styles/Dashboard.module.css';
import ReactCarousel from '../../components/Carousel';

export const getStaticPaths: GetStaticPaths = async () => {    
    return {
        paths: [
            '/852948164977098753/dashboard'
        ],
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
    let discordId = context['params']['discordId'] || false;

    let userFetch: Boolean | Response = false;
    let userObject: Object | Boolean = false;

    try {
        if (!userObject && discordId != false) {
            userFetch = await fetch(`https://discord.com/api/v9/users/${discordId}`);
            userObject = await userFetch.json();

            console.log(userObject);
        }
    } catch (err) {
        console.error(err);
    }
    
    return {
        props: {
            discordId
        }
    }
}

interface Props {
    discordId?: String;
    username?: String;
}

const Dashboard: React.FC<Props> = (props) => {

    console.log(props);

    return (
        <div>
            <Head>
                <title>Dashboard{props.discordId ? ` de ${props.discordId}` : ""} - AbbyCastle</title>
            </Head>

            <main>
                <ReactCarousel className={styles.peri_attrs_container} spacing={15}>
                    <div className={styles.periattr_container}>
                        <h1>Atributos</h1>
                    </div>
                    <div className={styles.periattr_container}>
                        <h1>Perícias</h1>
                    </div>
                </ReactCarousel>
            </main>
        </div>
    )
}

export default Dashboard;