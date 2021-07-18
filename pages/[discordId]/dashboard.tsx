
import React from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';

import Head from 'next/head';
import styles from '../../styles/Dashboard.module.scss';

import ReactCarousel from '../../components/ReactCarousel';
import Attr from '../../components/Attr';

import defaultAttrs from '../../config/attrs.config';

import Database from '../../utils/Database';
import HP_SAN_Progress from '../../components/HP_SAN_Progress';

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
        fallback: true,
    }
}

export interface DiscordUser {
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
    attrs?: {name: string, value: number}[];
    char?: {
        attrs: {name: string, value: number}[];
        name: string;
        id: DiscordUser['id'];
        attrsTotal?: number;
        avatar?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
    let props: Props = {};
    context['params']['discordId'] ? props.discordId = `${context['params']['discordId']}` : null;

    if (!props.discordId) return {
        props
    };

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
                if (props['user']) props.user.avatarURL = `https://cdn.discordapp.com/avatars/${props.discordId}/${props.user['avatarID']}.gif?size=${props.user.avatarSize}`;
            
                if (props && props.user && props.user.avatarURL) {
                    const fetched = await fetch(props.user.avatarURL);

                    if (!fetched.ok) throw new Error(fetched.statusText);
                } else {
                    throw new Error('avatarURL undefined');
                }
            } catch (err) {
                if (props['user']) props.user.avatarURL = `https://cdn.discordapp.com/avatars/${props.discordId}/${props.user['avatarID']}.png?size=${props.user.avatarSize}`;
            }
        }
    } catch (err) {
        console.error(err);
    }

    props.attrs = [];

    defaultAttrs.map(attrName => {
        props.attrs.push({name: attrName, value: 0});
    });

    try {
        let char = (await (new Database('chars')).get(props.discordId))['value'];

        if (!char) throw new Error("char invalid");

        props.char = char;

        console.log(props.char);
    } catch (err) {
        console.error(err);
    }

    try {
        let attrs = (await (new Database('chars')).get(props.discordId))['value']['attrs'];

        if (!attrs) throw new Error('attrs invalid');
        props.attrs = props.attrs.map(attr => {
            return attrs && attrs[0] ? attrs.find(a => a.name === attr.name) : attr;
        });
    } catch (err) {
        console.error(err);
    }

    return {
        props
    }
}


const Dashboard: React.FC<Props> = (props) => {

    if (!props.discordId) return (
        <div>
            <Head>
                <title>ID undefined</title>
            </Head>

            <main>
                <h1>ID não encontrado.</h1>
            </main>

        </div>
    )

    if (!props['char'] || !props['attrs']) return (
        <div>
            <Head>
                <title>Dashboard{(props.user && props.user['username']) ? `: ${props.user['username']}` : ""} - AbbyCastle</title>
            </Head>


            <div className={styles.avatar_container}>
                <img src={props['user']&&props['user']['avatarURL'] || ""} alt={props['user']&&props['user']['tag'] || "none"} />
            </div>

            <main style={{display: 'grid', placeItems: 'center', height: '100vh', textAlign: 'center'}}>
                <h1>
                    <p>{props.user.username}</p>
                    <p>Não possui um personagem.</p>
                </h1>
                <button style={{fontSize: '2em', width: '55vw', height: '15vh', background: 'transparent', borderRadius: '5em', border: '1px solid gray', color: '#fff'}}>Crie um</button>
            </main>
        </div>
    );

    return (
        <div>
            <Head>
                <title>Dashboard{(props.user && props.user['username']) ? `: ${props.user['username']}` : ""} - AbbyCastle</title>
            </Head>

            <div className={styles.avatar_container}>
                <img src={props['user']&&props['user']['avatarURL'] || ""} alt={props['user']&&props['user']['tag'] || "none"} />
            </div>

            <main>
                <ReactCarousel className={styles.peri_attrs_container} slidesPerView={1} initial={1} >
                    <div className={styles.sanity_hp_container}>
                        <HP_SAN_Progress className="__hp" char={props.char} />
                        <HP_SAN_Progress className="__sanity" char={props.char} />
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
                    </div>
                    <div className={styles.periattr_container}>
                        {Array.isArray(props['attrs']) && typeof props['attrs'][0] !== 'undefined' ? props['attrs'].map(({name, value}) => Attr({name, value, key: `${name}`.replace("ã", 'a').replace('ê', 'e').replace("ç", 'c'), char: props.char})) : "ERRO AO CARREGAR ATRIBUTOS"}
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