import "../../styles/Components/common/AddBtn.scss";
import IconBtn from "./IconBtn";



interface Props {
    text?: string;
    callback: () => void;
}



export default function AddBtn(props: Props) {
    return (
        <div className="add-btn-wrapper">
            {props.text !== undefined
                ?
                    <label>
                        <p className="add-btn-wrapper__text">{props.text}</p>
                        <div className="add-btn-wrapper__btn-box">
                            <IconBtn
                                border   = {true}
                                callback = {props.callback}
                                iconName = "add"
                            />
                        </div>
                    </label>
                :
                    <div className="add-btn-wrapper__btn-box">
                        <IconBtn
                            border   = {true}
                            callback = {props.callback}
                            iconName = "add"
                        />
                    </div>
            }
        </div>
    )
}