import { useState } from "react";
import Database from "../utils/Database";

export interface AttrProps {
    key?: any;
    name: string;
    value?: number;
    char?: {id: string, attrs: object[]};
}

const db = new Database('chars');

const Attr: React.FC<AttrProps> = (props = {name: 'Força', value: 0, char: {id: '', attrs: []}}) => {
    const [attr, setAttr] = useState({name: props.name, value: props.value});
    const [attrs, setAttrs] = useState(props.char.attrs);

    let maxInput = 40;

    if (props.name === "Preparo") maxInput = 8;

    return (
        <div>
            <span>{props.name}</span>
            <input value={attr.value} onChange={(e) => {e.target.valueAsNumber <= maxInput && e.target.valueAsNumber >= 0 ? [setAttr({name: attr.name, value: e.target.valueAsNumber}), setAttrs([...attrs, attr]), db.set(props.char.id, attrs)] : null;}} type="number" min={0} max={maxInput} />
        </div>
    );
}

export default Attr;
