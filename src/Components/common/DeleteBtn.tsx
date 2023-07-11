import IconBtn from "./IconBtn";



interface Props {
    callback: () => void;
}



export default function DeleteBtn(props: Props) {
    return (
        <div className="delete-btn-wrapper">
            <IconBtn
                iconImage = "remove"
                callback = {props.callback}
                border   = {true}
            />
        </div>
    )
}