import JSONExtended from './ExtendedJSON';

interface Document {
    key: string;
    value: any;
    path?: string;
    dontExist?: true;
}

export default class Database {
    name = 'default';
    baseURL = `https://abbydb.mkishereoficial.repl.co/database/default`;

    constructor(name = 'default') {
        Object.defineProperty(this, 'name', {writable: false, value: name});
        Object.defineProperty(this, 'baseURL', {writable: false, value: `https://abbydb.mkishereoficial.repl.co/database/${this.name}`});
    }

    async all() {
        const keysAndValues = new Map<Document['key'], Document>();

        await fetch(`${this.baseURL}/all`).then(async data => {
            const json = await data.json();

            const array = json['all'];

            array.map(t => {
                const obj: Document = {
                    key: t['key'],
                    value: t['value'],
                };
    
                keysAndValues.set(obj.key, obj);
            });
        }).catch(console.error);

        return keysAndValues;
    }

    async get(key: Document['key']) {
        let obj: Document;

        await fetch(`${this.baseURL}/${key}`).then(async data => {
            const json = await data.json();

            if (!json) obj = {key, value: json, dontExist: true};

            obj = json;
        }).catch(console.error);

        return obj;
    }

    async set(key: Document['key'], value: Document['value']) {
        let obj: Document;

        value = JSONExtended.isJSONParsable(value) ? value : JSON.stringify(value);

        await fetch(`${this.baseURL}/${key}/set`, {method: 'POST', body: value, mode: 'no-cors'}).then(async data => {
            try {
                const json = await data.json();

                obj = json;
            } catch (err){
                obj = {
                    key,
                    value: JSONExtended.isJSON(value) || value,
                    path: `${this.baseURL}/${key}`,
                }
            }

            //obj = json;
        }).catch(console.error);

        return obj;
    }
}