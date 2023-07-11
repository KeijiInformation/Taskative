import { Task } from "../../Class";
import { useContext, useState } from "react";
import IconBtn from "./IconBtn";
import NormalBtn from "./NormalBtn";
import InputForm from "./InputForm";
import "../../styles/Components/common/TaskPop.scss";
import { UserDataContext } from "../../App";
import { Tasks } from "../../Class/data";


interface Props {
    tasks: Tasks;
    task: Task;
    setisPop: React.Dispatch<React.SetStateAction<boolean>>;
}



export default function TaskPop(props: Props) {
    //////////////////////////////////////////////////////////////////////
    // global
    //////////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // submit
    //////////////////////////////////////////////////////////////////////
    const [validateResult, setvalidateResult] = useState<boolean>(false);



    function registerTask(): void {
        // 新規登録
        if (props.task.id < 0) {
            // uid, idの決定
            props.task.uid = userData.config.uid;
            props.task.id = userData.tasks.getMaxID() + 1;
            // registeredとdeletedの決定
            const today = new Date();
            props.task.deleted = [false, -1, -1, -1];
            props.task.registered = [today.getFullYear(), today.getMonth()+1, today.getDate()];
            // orderの決定
            props.task.order = userData.tasks.getMaxOrder() + 1;
            // tasksへの追加
            props.tasks.add(props.task);
            userData.config.updateIdRange(props.tasks);
        // 更新
        } else {
            props.tasks.upload();
        }
        // popupのClose
        props.setisPop(false);
    }



    function handleSubmit(): boolean {
        if (validateResult) {
            registerTask();
            return true;
        } else {
            return false;
        }
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////
    return (
        <div className="task-pop-wrapper">
            <div className="task-pop-wrapper__title-box">
                {props.task.id >= 0
                ?
                    <>
                        <p className="task-pop-wrapper__title-box--title">タスクの編集</p>
                        <div className="task-pop-wrapper__title-box--delete-btn-box">
                            <IconBtn
                                iconImage = "delete"
                                border   = {false}
                                callback = {() => {props.tasks.delete(props.task.id); props.setisPop(false)}}
                            />
                        </div>
                    </>
                :
                    <p className="task-pop-wrapper__title-box--title">新しいタスクの追加</p>
                }
            </div>
            <div className="task-pop-wrapper__form-box">
                <InputForm
                    task              = {props.task}
                    setvalidateResult = {setvalidateResult}
                />
            </div>
            <div className="task-pop-wrapper__btn-box">
                <NormalBtn
                    text     = "戻る"
                    callback = {() => {props.setisPop(false); return true;}}
                />
                <NormalBtn
                    text     = "保存"
                    callback = {handleSubmit}
                    canClick = {validateResult}
                />
            </div>
        </div>
    )
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
}