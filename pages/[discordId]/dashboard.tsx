
import React from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';

import Head from 'next/head';
import styles from '../../styles/Dashboard.module.scss';

import ReactCarousel from '../../components/ReactCarousel';
import Attr from '../../components/Attr';

import defaultAttrs from '../../config/attrs.config';

import Database from '../../utils/Database';

export const getStaticPaths: GetStaticPaths = async () => {    
    const paths = [
        '/852948164977098753/dashboard'
    ];

    const db = new Database('chars');

    Array.from((await db.all()).keys()).map(key => {
        paths.push(`/${key}/dashboard`);
    });

    return {
        paths,
        fallback: false,
    }
}

interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    tag?: string;
    avatarID: string;
    avatarSize: 1024 | 2048 | 4096;
    avatarURL?: string;
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
                avatarID: userObject['avatar'],
                avatarSize: 4096,
            } : null;

            try {
                props.user.avatarURL = `https://cdn.discordapp.com/avatars/${props.discordId}/${props.user['avatarID']}.gif?size=${props.user.avatarSize}`;
            
                const fetched = await fetch(props.user.avatarURL);

                if (!fetched.ok) throw new Error(fetched.statusText);
            } catch (err) {
                props.user.avatarURL = `https://cdn.discordapp.com/avatars/${props.discordId}/${props.user['avatarID']}.png?size=${props.user.avatarSize}`;
            }
        }
    } catch (err) {
        console.error(err);
    }

    props.attrs = defaultAttrs;

    try {
        props.attrs = (await (new Database('chars')).get(props.discordId)).value['attrs'];
    } catch (err) {
        console.error(err);
    }

    console.table(props.attrs);

    return {
        props
    }
}


const Dashboard: React.FC<Props> = (props) => {
    return (
        <div>
            <Head>
                <title>Dashboard{(props.user && props.user['username']) ? `: ${props.user['username']}` : ""} - AbbyCastle</title>
            </Head>

            <div className={styles.avatar_container}>
                <img src={props.user['avatarURL']} alt={props.user['tag']} />
            </div>

            <main>
                <ReactCarousel className={styles.peri_attrs_container} slidesPerView={1} initial={1} >
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
                        {Array.isArray(props['attrs']) ? props['attrs'].map(({name, value}) => Attr({name, value, key: name, char: {id: props.discordId, attrs: props.attrs}})) : "ERRO AO CARREGAR ATRIBUTOS"}
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