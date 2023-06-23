import { NormalBtn } from "../../common";
import "../../../styles/Components/main/MainTop.scss";
import { Tasks } from "../../../Class/data";
import TasksInput from "./TasksInput";




interface Props {
    setContentsID: (id: number) => void;
    tasks: Tasks;
    setTasks: (callback: (tasks: Tasks) => Tasks) => void;
    validateTasksInput: () => boolean;
    tasksInputError: [boolean, string];
}



export default function MainTop(props: Props) {
    ////////////////////////////////////////////////////////////////////////
    // descide tasks
    ////////////////////////////////////////////////////////////////////////
    function moveSection(): boolean {
        if (props.validateTasksInput()) {
            props.setContentsID(1);
            return true;
        } else {
            return false;
        }
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////////////
    return (
        <div className="main-top-wrapper">
            <div className="main-top-wrapper__message-box">
                {props.tasks.data.length === 0
                ?
                    <>
                    <p className="main-top-wrapper__message-box--message">ようこそ、Taskativeへ</p>
                    <p className="main-top-wrapper__message-box--message">タスクが登録されていません</p>
                    <p className="main-top-wrapper__message-box--message">歯車マークからタスクを登録しましょう</p>
                    </>
                :
                    <>
                    <p className="main-top-wrapper__message-box--message">ようこそ、Taskativeへ</p>
                    <p className="main-top-wrapper__message-box--message">今日のタスクを選択してください</p>
                    </>
                }
            </div>
            {props.tasks.data.length !== 0 &&
                <>
                    <div className="main-top-wrapper__tasks-input-box">
                    <TasksInput
                        tasks = { props.tasks }
                        setTasks = { props.setTasks }
                    />
                    {!props.tasksInputError[0] && <p className="tasks-input-error-message error-message">{props.tasksInputError[1]}</p>}
                    </div>
                    <div className="main-top-wrapper__btn-wrapper">
                        <NormalBtn
                            text     = "時間を決める"
                            callback = { moveSection }
                        />
                    </div>
                </>
            }
            
        </div>
    )
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
}