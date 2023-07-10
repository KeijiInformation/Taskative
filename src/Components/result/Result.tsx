import { useContext, useState, useEffect } from "react";
import { UserDataContext } from "../../App";
import { CircleGraph, TimeGraph, DateView, DateInput } from "./Components";
import "../../styles/Components/result/Result.scss";


export default function Result() {
    //////////////////////////////////////////////////////////////////////////
    // global
    //////////////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////
    // state
    //////////////////////////////////////////////////////////////////////////
    // タブの情報
    const [selectedTab, setselectedTab] = useState<"year" | "month" | "week">("week");



    // リザルトデータの情報
    const [idsArr, setidsArr] = useState<number[]>([]);
    const [idealMinutesArr, setidealMinutesArr] = useState<number[]>([]);
    const [actualMinutesArr, setactualMinutesArr] = useState<number[]>([]);



    // 選択中の日付情報
    const [onYear, setonYear] = useState<string>(() => {
        const today = new Date();
        return `${today.getFullYear()}`;
    })
    const [onMonth, setonMonth] = useState<string>(() => {
        const today = new Date();
        return `${today.getFullYear()}/${today.getMonth()+1}`;
    })
    const [onWeek, setonWeek] = useState<[string, string]>(() => {
        const today = new Date();
        let start: Date = new Date();
        start.setDate( today.getDate() - today.getDay() + 1 )
        let end: Date = new Date();
        end.setDate( today.getDate() + (7 - today.getDay()) )
        return [`${start.getFullYear()}/${start.getMonth()+1}/${start.getDate()}`, `${end.getFullYear()}/${end.getMonth()+1}/${end.getDate()}`];
    })
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////
    // change tab
    //////////////////////////////////////////////////////////////////////////
    function changeTab(moveTarget: "year" | "month" | "week"): boolean {
        let resultData: [number[], number[], number[]];
        if (moveTarget === "year") {
            resultData = userData.result.createDataForPage([Number(onYear)]);
        } else if (moveTarget === "month") {
            resultData = userData.result.createDataForPage(onMonth.split("/").map(dateStr => Number(dateStr)));
        } else {
            resultData = userData.result.createDataForPage(onWeek[0].split("/").map(dateStr => Number(dateStr)));
        }
        setidsArr(resultData[0]);
        setidealMinutesArr(resultData[1]);
        setactualMinutesArr(resultData[2]);
        setselectedTab(moveTarget);
        return true;
    }
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////
    // 初期処理
    //////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        changeTab("week");
    }, [])
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////////
    return (
        <div className="result-page-wrapper">






            {/* 選択タブ */}
            <ul className="result-page-wrapper__tab-select-btn-list">
                <li className={`result-page-wrapper__tab-select-btn-list--tab year ${selectedTab === "year" ? "selected" : ""}`}><button onClick={() => changeTab("year")}>年間</button></li>
                <li className={`result-page-wrapper__tab-select-btn-list--tab month ${selectedTab === "month" ? "selected" : ""}`}><button onClick={() => changeTab("month")}>月間</button></li>
                <li className={`result-page-wrapper__tab-select-btn-list--tab week ${selectedTab === "week" ? "selected" : ""}`}><button onClick={() => changeTab("week")}>週間</button></li>
            </ul>






            {/* 日付の表示 */}
            <div className="result-page-wrapper__date-box">
                <DateView
                    onYear      = {onYear}
                    onMonth     = {onMonth}
                    onWeek      = {onWeek}
                    selectedTab = {selectedTab}
                />
                <DateInput
                    setonYear      = {setonYear}
                    setonMonth     = {setonMonth}
                    setonWeek      = {setonWeek}
                    onYear      = {onYear}
                    onMonth     = {onMonth}
                    onWeek      = {onWeek}
                    selectedTab = {selectedTab}
                />
            </div>






            {/* グラフの表示 */}
            <div className="result-page-wrapper__contents">
                <TimeGraph
                    idsArr           = {idsArr}
                    idealMinutesArr  = {idealMinutesArr}
                    actualMinutesArr = {actualMinutesArr}
                />
                <CircleGraph
                    idsArr           = {idsArr}
                    idealMinutesArr  = {idealMinutesArr}
                    actualMinutesArr = {actualMinutesArr}
                />
            </div>






        </div>
    )
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
}