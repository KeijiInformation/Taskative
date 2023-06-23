// import assets
import "../../styles/Components/common/MovePageBtn.scss";



interface Props {
    icon    : string;
    title   : string;
    clicked : boolean;
    callback: () => void;
}

export default function MovePageBtn(props: Props) {
    return (
        <div className={`move-page-btn-wrapper ${props.title} ${props.clicked ? "clicked": ""}`}>
            <button className={`move-page-btn-wrapper__btn ${props.title}`} onClick={() => props.callback()}></button>
            <span className="material-symbols-outlined move-page-btn-wrapper__img">{props.icon}</span>
        </div>
    )
}