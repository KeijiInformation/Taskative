import { useContext, useState } from "react";
import { UserDataContext } from "../../../App";
import "../../../styles/Components/result/DateInput.scss";



interface Props {
    setonYear:  React.Dispatch<React.SetStateAction<string>>;
    setonMonth: React.Dispatch<React.SetStateAction<string>>;
    setonWeek:  React.Dispatch<React.SetStateAction<[string, string]>>;
    onYear: string;
    onMonth: string;
    onWeek: [string, string];
    selectedTab: "year" | "month" | "week";
}



export default function DateInput(props: Props) {
    //////////////////////////////////////////////////////////////////////
    // global
    //////////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // 日付の範囲を決定
    //////////////////////////////////////////////////////////////////////
    const [minDate, setminDate] = useState<Date>(() => {
        const registerd: [number, number, number] = userData.config.registered;
        const date: Date = new Date(`${registerd[0]}/${registerd[1]}/${registerd[2]}`);
        date.setDate( date.getDate() - (date.getDay()-1) );
        return date;
    });
    const [maxDate, setmaxDate] = useState<Date>(() => {
        const date: Date = new Date();
        if (date.getDay() !== 0) {
            date.setDate( date.getDate() + (7 - date.getDay()) );
        }
        return date;
    });
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // 現在のStateをinputのvalueに適した書式に変換する
    //////////////////////////////////////////////////////////////////////
    function stateToInput(): string {
        if (props.selectedTab === "year") {
            return props.onYear;
        } else if (props.selectedTab === "month") {
            const dateList: [string, string] = props.onMonth.split("/") as [string, string];
            return `${dateList[0]}-${numTo2Digits(Number(dateList[1]))}`;
        } else {
            const dateList: [string, string, string] = props.onWeek[0].split("/") as [string, string, string];
            return `${dateList[0]}-${numTo2Digits(Number(dateList[1]))}-${numTo2Digits(Number(dateList[2]))}`;
        }
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // 変更したときに値を更新する関数
    //////////////////////////////////////////////////////////////////////
    function handleOnchange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        if (props.selectedTab === "year") {
            props.setonYear(e.target.value);
        } else if (props.selectedTab === "month") {
            const date: Date = new Date(e.target.value);
            props.setonMonth(`${date.getFullYear()}/${date.getMonth()+1}`);
        } else {
            const date: Date = new Date(e.target.value);
            const weekStart: Date = new Date(date);
            const weekEnd:   Date = new Date(date);
            weekEnd.setDate( date.getDate() + 6 );
            props.setonWeek([`${weekStart.getFullYear()}/${weekStart.getMonth()+1}/${weekStart.getDate()}`, `${weekEnd.getFullYear()}/${weekEnd.getMonth()+1}/${weekEnd.getDate()}`])
        }
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // その他関数
    //////////////////////////////////////////////////////////////////////
    // 配列作成用
    function range(start: number, end: number, step?: number): number[] {
        if (!step) {
            step = 1;
        }
        const result: number[] = [];
        let num = 0;
        for (let i=start; i<end; i++) {
            if (num % step === 0) {
                result.push(i);
            }
        }
        return result;
    }



    // 2桁の数字に書式を変換する関数(6月 -> 06月などへの変換)
    function numTo2Digits(num: number): string {
        if (`${num}`.length === 1) {
            return `0${num}`;
        } else {
            return `${num}`;
        }
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////
    return (
        <div className="date-input-wrapper">
            <div className="date-input-wrapper__input-box">






                {/* 年 */}
                {props.selectedTab === "year" &&
                    <select className="date-input-wrapper__input-box--input" onChange={(e) => handleOnchange(e)} value={stateToInput()}>
                        {range(minDate.getFullYear()-1, maxDate.getFullYear()+1).map((year, index) => {
                            return <option value={year} key={"date-input-year-selection#"+index}>{year}</option>
                        })}
                    </select>
                }






                {/* 月 */}
                {props.selectedTab === "month" &&
                    <input
                        type="month"
                        max={`${maxDate.getFullYear()}-${numTo2Digits(maxDate.getMonth()+1)}`}
                        min={`${minDate.getFullYear()}-${numTo2Digits(minDate.getMonth()+1)}`}
                        value={stateToInput()}
                        className="date-input-wrapper__input-box--input"
                        onChange={(e) => handleOnchange(e)}
                    />
                }






                {/* 週 */}
                {props.selectedTab === "week" &&
                    <input
                        type="date"
                        max={`${maxDate.getFullYear()}-${numTo2Digits(maxDate.getMonth()+1)}-${numTo2Digits(maxDate.getDate())}`}
                        min={`${minDate.getFullYear()}-${numTo2Digits(minDate.getMonth()+1)}-${numTo2Digits(minDate.getDate())}`}
                        step="7"
                        value={stateToInput()}
                        className="date-input-wrapper__input-box--input"
                        onChange={(e) => handleOnchange(e)}/>
                }
            </div>
        </div>
    )
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
}