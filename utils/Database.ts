interface Document {
    key: string;
    value: any;
    path?: string;
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

            obj = json;

        }).catch(console.error);

        return obj;
    }

    async set(key: Document['key'], value: Document['value']) {
        let obj: Document;

        await fetch(`${this.baseURL}/${key}`, {method: 'POST', body: JSON.stringify(value)}).then(async data => {
            const json = await data.json();

            obj = json;
        }).catch(console.error);

        return obj;
    }
}