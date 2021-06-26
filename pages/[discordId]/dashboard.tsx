
import React from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';

import Head from 'next/head';

import styled from 'styled-components';

import styles from '../../styles/Dashboard.module.scss';
import ReactCarousel from '../../components/ReactCarousel';

export const getStaticPaths: GetStaticPaths = async () => {    
    return {
        paths: [
            '/852948164977098753/dashboard'
        ],
        fallback: true,
    }
}

interface DiscordUser {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    toString?: () => string;
    [key: string]: any;
}

interface Props {
    discordId?: string;
    user?: DiscordUser;
    [key: string]: any;
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
    let props: Props = {};
    context['params']['discordId'] ? props.discordId = `${context['params']['discordId']}` : null;

    let userFetch: Boolean | Response = false;
    let userObject: DiscordUser | Boolean = false;

    try {
        if (!userObject && typeof props.discordId !== "undefined") {
            userFetch = await fetch(`https://discord.com/api/v9/users/${props.discordId}`, {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
                  }
            });
            userObject = await userFetch.json();
            userObject && userObject['username'] ? props.user = {
                id: userObject['id'],
                username: userObject['username'],
                tag: `${userObject['username']}#${userObject['discriminator']}`,
                discriminator: userObject['discriminator'],
                avatar: userObject['avatar'],
            } : null;
        }
    } catch (err) {
        console.error(err);
    }
    
    return {
        props
    }
}


const Dashboard: React.FC<Props> = (props) => {

    console.log(props);

    return (
        <div>
            <Head>
                <title>Dashboard{(props.user && props.user['username']) ? ` de ${props.user['username']}` : ""} - AbbyCastle</title>
            </Head>

            <main>
                <ReactCarousel className={styles.peri_attrs_container} slidesPerView={1}>
                    <div className={styles.sanity_hp_container}>
                        <div className="__hp">
                            <div>
                                <span>HP</span>
                                <div>
                                    <input defaultValue={50} type={"number"} />
                                    <i>/</i>
                                    <span>100</span>
                                </div>
                            </div>
                            <progress max={100} value={50}></progress>
                        </div>
                        <div className="__sanity">
                            <div>
                                <span>Sanidade</span>
                                <div>
                                    <input defaultValue={50} type={"number"} />
                                    <i>/</i>
                                    <span>100</span>
                                </div>
                            </div>
                            <progress max={100} value={50}></progress>
                        </div>
                        <div className="__d_c_exp">
                            <div className="__xdamage">
                                <h2>Dano Extra</h2>
                                <input defaultValue="0" type="number" />
                            </div>
                            <div className="__corpo">
                                <h2>Corpo</h2>
                                <input defaultValue="0" type="number" />
                            </div>
                            <div className="__exp">
                                <h2>EXP.</h2>
                                <input defaultValue="0" type="number" />
                            </div>
                        </div>
                        <button>Salvar</button>
                    </div>
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