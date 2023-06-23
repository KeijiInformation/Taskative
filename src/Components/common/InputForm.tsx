import { Task } from "../../Class";
import { useState } from "react";
import "../../styles/Components/common/InputForm.scss";



interface Props {
    task: Task;
    setvalidateResult: (newState: boolean) => void;
}



export default function InputForm(props: Props) {
    //////////////////////////////////////////////////////////////////////
    // input data
    //////////////////////////////////////////////////////////////////////
    const [title, settitle] = useState<string>(props.task.title);
    const [max, setmax] = useState<string>(() => {
        if (props.task.max < 0) {
            return "0";
        } else {
            return String(props.task.max);
        }
    })
    const [min, setmin] = useState<string>(() => {
        if (props.task.min < 0) {
            return "0";
        } else {
            return String(props.task.min);
        }
    });
    const [isRequired, setisRequired] = useState<boolean>(props.task.isRequired);
    const [isExtendable, setisExtendable] = useState<boolean>(props.task.isExtendable);
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // submit form data
    //////////////////////////////////////////////////////////////////////
    function handleTimeBlur(event: React.ChangeEvent<HTMLInputElement>): void {
        if (event.target.name === "max") {
            setmax(() => {
                // 有効な数字かどうかの判定
                if (!Number.isNaN(event.target.value) && Number(event.target.value) >= 0) {
                    // min < max
                    if (Number(event.target.value) > Number(min)) {
                        return event.target.value;
                    // min >= max
                    } else {
                        return min;
                    }
                } else {
                    return min;
                }
            })
        } else {
            setmin(() => {
                // 有効な数字かどうかの判定
                if (!Number.isNaN(event.target.value) && Number(event.target.value) >= 0) {
                    // min < max
                    if (Number(event.target.value) < Number(max)) {
                        return event.target.value;
                    // min >= max
                    } else {
                        return max;
                    }
                } else {
                    return `0`;
                }
            })
        }
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // error state
    //////////////////////////////////////////////////////////////////////
    interface Error {
        title: string[],
        max: string[],
        min: string[],
        isRequired: string[],
        isExtendable: string[],
    }
    const [error, seterror] = useState<Error>({
        "title": [],
        "max": [],
        "min": [],
        "isRequired": [],
        "isExtendable": []
    })
    function isNoError(): boolean {
        let result = true;
        const errors: Error = validate();
        Object.values(errors).forEach(errMessageList => {
            if (errMessageList.length > 0) {
                result = false;
            }
        })
        seterror(errors);
        props.setvalidateResult(result);
        if (result) {
            props.task.title        = title;
            props.task.max          = Number(max);
            props.task.min          = Number(min);
            props.task.isRequired   = isRequired;
            props.task.isExtendable = isExtendable;
        }
        return result;
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // validate data
    //////////////////////////////////////////////////////////////////////
    function validate(): Error {
        // title
        const titleError: string[] = [];
        if (title.length > 20) {
            titleError.push("20文字以下で入力してください。");
        } else if (title.length === 0) {
            titleError.push("入力してください。");
        }
        // max, min
        const maxError: string[] = [];
        const minError: string[] = [];
        if (Number.isNaN(max) || Number.isNaN(min) || max.length === 0 || min.length === 0) {
            if (Number.isNaN(max) || max.length === 0) {
                maxError.push("数値を入力してください。");
            }
            if (Number.isNaN(min) || min.length === 0) {
                minError.push("数値を入力してください。");
            }
        }
        // isRequired
        const isRequiredError: string[] = [];
        // isExtendable
        const isExtendableError: string[] = [];
        return {
            "title": titleError,
            "max": maxError,
            "min": minError,
            "isRequired": isRequiredError,
            "isExtendable": isExtendableError,
        }
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////
    return (
        <div className="input-form-wrapper">
            <form className="input-form-wrapper__form">

                <div className="input-form-wrapper__form--input-box">
                    <label>
                        <p>タイトル</p>
                            <input type="text" name="title" value={title} defaultValue={title} onChange={(event => settitle(event.target.value))} onBlur={isNoError}/>
                        <ul className="error-message-list">
                            {error["title"].map((errorMessage, index) => {
                                return (
                                    <li className="error-message-list__message" key={"error-message-list__messaged-title" + index}>
                                        <p className="error-message-list__message--text">{errorMessage}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </label>
                </div>

                <div className="input-form-wrapper__form--input-box">
                    <label>
                        <p>最大時間（分）</p>
                        <input type="number" name="max" value={max} defaultValue={max} onChange={(event) => setmax(event.target.value)} onBlur={(event) => {handleTimeBlur(event); isNoError();}}/>
                        <ul className="error-message-list">
                            {error["max"].map((errorMessage, index) => {
                                return (
                                    <li className="error-message-list__message" key={"error-message-list__messaged-max" + index}>
                                        <p className="error-message-list__message--text">{errorMessage}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </label>
                </div>

                <div className="input-form-wrapper__form--input-box">
                    <label>
                        <p>最小時間（分）</p>
                        <input type="number" name="min" value={min} defaultValue={min} onChange={(event) => setmin(event.target.value)} onBlur={(event) => {handleTimeBlur(event); isNoError();}}/>
                        <ul className="error-message-list">
                            {error["min"].map((errorMessage, index) => {
                                return (
                                    <li className="error-message-list__message" key={"error-message-list__messaged-min" + index}>
                                        <p className="error-message-list__message--text">{errorMessage}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </label>
                </div>

                <div className="input-form-wrapper__form--input-check-box">
                    <label>
                        <input type="checkbox" name="isRequired" defaultChecked={isRequired} onChange={event => setisRequired(event.target.checked)} onBlur={isNoError}/>
                        <p>必須にする</p>
                        <ul className="error-message-list">
                            {error["isRequired"].map((errorMessage, index) => {
                                return (
                                    <li className="error-message-list__message" key={"error-message-list__messaged-isRequired" + index}>
                                        <p className="error-message-list__message--text">{errorMessage}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </label>
                </div>

                <div className="input-form-wrapper__form--input-check-box">
                    <label>
                        <input type="checkbox" name="isExtendable" defaultChecked={isExtendable} onChange={event => setisExtendable(event.target.checked)} onBlur={isNoError}/>
                        <p>上限を超えた時間配分を許可する</p>
                        <ul className="error-message-list">
                            {error["isExtendable"].map((errorMessage, index) => {
                                return (
                                    <li className="error-message-list__message" key={"error-message-list__messaged-isExtendable" + index}>
                                        <p className="error-message-list__message--text">{errorMessage}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </label>
                </div>
            </form>
        </div>
    )
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
}