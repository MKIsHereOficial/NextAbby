import { useEffect, useState } from "react";
import Char from "../typings/Char";
import Database from "../utils/Database";

export interface Props {
    className: "__hp" | "__sanity";
    char: Char;
}

const db = new Database('chars');

const HP_SAN_Progress: React.FC<Props> = (props) => {
    let char: Char = props.char;
    let [ref, setRef] = useState({value: 100, max: 100});

    const [value, setValue] = useState(ref.value);
    const [maxValue, setMaxValue] = useState(ref.max);


    useEffect(() => {
        const objRef = char[props.className.replace("__", "")];

        setRef((state) => {

            setValue(objRef.value);
            setMaxValue(objRef.max);

            return objRef;
        });
    }, []);

    useEffect(() => {
        if (char && char['name'] && char['id']) {
            if (props.className.replace("__", "") === "hp") db.set(props.char.id, {...char, hp: ref});
            else db.set(props.char.id, {...char, sanity: ref});
        }
    }, [ref]);


    const onValueChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue((state) => {
            let val = Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;

            setRef((state) => {
                char[props.className.replace("__", "")] = {max: ref.max, value: val};

                return {max: ref.max, value: val};
            })

            return val;
        })
    }

    const onMaxValueChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setMaxValue((state) => {
            let val = Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;

            if (value >= val) setValue(state => {return val});

            setRef((state) => {
                char[props.className.replace("__", "")] = {max: val, value: ref.value};

                return {max: val, value: ref.value};
            })

            return val;
        })
    }

    return (
        <div className={props.className}>
            <div>
                <span>{props.className === "__hp" ? "HP" : "Sanidade"}</span>
                <div>
                    <input type={"number"} value={value} min={0} max={maxValue} onChange={onValueChange} />
                    <i>/</i>
                    <input type={"number"} value={maxValue} min={0} onChange={onMaxValueChange} />
                </div>
            </div>
            <progress max={maxValue} value={value}></progress>
        </div>
    )
}

export default HP_SAN_Progress;
