import { useState } from "react";
import Char from "../typings/Char";
import Database from "../utils/Database";

export interface AttrProps {
    key?: any;
    name: string;
    value?: number;
    char?: Char;
}

const db = new Database('chars');

const Attr: React.FC<AttrProps> = (props = {name: 'Força', value: 0}) => {
    const [attr, setAttr] = useState({name: props.name, value: props.value});
    const [char, setChar] = useState(props.char);

    let attrs = char.attrs;

    let maxInput = 40;

    if (props.name === "Preparo") maxInput = 8;

    const onChange = async (e) => {
        if (e.target.valueAsNumber <= maxInput && e.target.valueAsNumber >= 0) { 

            setAttr((state) => {
                attrs[attrs.findIndex(a => a.name === attr.name)] = {name: state.name, value: e.target.valueAsNumber};
                setChar(state => {
                    db.set(props.char.id, {...state, attrs});
    
                    return {...state, attrs};
                });
                
                return {name: state.name, value: e.target.valueAsNumber};
            });

        }
    }

    return (
        <div key={props.key}>
            <span>{props.name}</span>
            <input value={attr.value} onChange={onChange} type="number" min={0} max={maxInput} />
        </div>
    );
}

export default Attr;
