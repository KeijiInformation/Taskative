import "../../styles/Components/common/IconBtn.scss";



interface Props {
    iconName: string;
    border: boolean;
    callback: () => void;
}



export default function IconBtn(props: Props) {
    return (
        <>
            {props.border
            ?
                <div className="icon-btn-wrapper">
                    <div className="icon-btn-wrapper__btn-box">
                        <span className="material-symbols-outlined icon-btn-wrapper__btn-box--icon">{props.iconName}</span>
                        <button className="icon-btn-wrapper__btn-box--btn" onClick={props.callback}></button>
                    </div>
                </div>
            :
                <div className="icon-btn-wrapper no-border">
                    <div className="icon-btn-wrapper__btn-box">
                        <span className="material-symbols-outlined icon-btn-wrapper__btn-box--icon">{props.iconName}</span>
                        <button className="icon-btn-wrapper__btn-box--btn" onClick={props.callback}></button>
                    </div>
                </div>
            }
        </>
    )
}