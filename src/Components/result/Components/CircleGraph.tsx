import { useEffect, useState, useContext } from "react";
import "../../../styles/Components/result/CircleGraph.scss";
import { UserDataContext } from "../../../App";
// import { Pie } from "react-chartjs-2";



interface Props {
    idsArr: number[];
    actualMinutesArr: number[],
    idealMinutesArr: number[],
}


export default function CircleGraph(props: Props) {
    ///////////////////////////////////////////////////////////////////////////////////
    // global
    ///////////////////////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////////
    // states
    ///////////////////////////////////////////////////////////////////////////////////
    const [colorList, setcolorList]   = useState<[number, number, number][]>([]);
    const [degreeList, setdegreeList] = useState<number[]>([]);
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////////
    // 色の作成
    ///////////////////////////////////////////////////////////////////////////////////
    function createColorNum(): number {
        return Math.floor(Math.random()*256);
    }
    function createRandomColor(): [number, number, number] {
        return [createColorNum(), createColorNum(), createColorNum()];
    }
    function createRandomColorsList(numOfColor: number): Array< [number, number, number] > {
        const result: Array< [number, number, number] > = [];
        while (result.length < numOfColor) {
            let isExistColor = false;
            let newColor: [number, number, number] = createRandomColor();
            result.forEach(color => {
                if (color[0] === newColor[0] && color[1] === newColor[1] && color[2] === newColor[2]) {
                    isExistColor = true;
                }
            })
            if (!isExistColor) {
                result.push(newColor);
            }
        }
        return result;
    }
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////////
    // 割合の計算と色の決定
    ///////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        let actualMinutesSum = 0;
        props.actualMinutesArr.forEach(num => actualMinutesSum += num);
        const actualRatioArr: number[] = props.actualMinutesArr.map(minutes => minutes / actualMinutesSum);
        let ondeg = 0;
        const degreeArr: number[] = actualRatioArr.map(ratio => {
            let degree: number = 360 * ratio;
            ondeg += degree;
            if (ondeg > 360) {
                ondeg = 360;
            }
            return ondeg;
        })
        const colorList: Array<[number, number, number]> = createRandomColorsList(props.idsArr.length);
        setdegreeList(degreeArr);
        setcolorList(colorList);
    }, [props.actualMinutesArr, props.idsArr])
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////////
    // グラフの描画
    ///////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        // conic gradient の各ゾーンの色と角度を作成
        const conicGradientElems: string[] = [];
        for (let i=0; i<degreeList.length; i++) {
            const degree: number = degreeList[i];
            const color: [number, number, number] = colorList[i];
            let degreeRange: [number, number];
            if (i === 0) {
                degreeRange = [0, degree];
            } else {
                degreeRange = [degreeList[i-1], degree];
            }
            let newZone: string = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6) ${degreeRange[0]}deg ${degreeRange[1]}deg`;
            conicGradientElems.push(newZone);
        }
        // conic-gradientの文字列を作成
        let conicGradientStr: string = "conic-gradient(";
        conicGradientElems.forEach((elem, index) => {
            if (index === conicGradientElems.length-1) {
                conicGradientStr += elem + ")";
            } else {
                conicGradientStr += elem + ", ";
            }
        })
        // conic-gradientを円グラフに適用
        const chart: HTMLElement = document.querySelector(".circle-graph-wrapper__chart") as HTMLElement;
        chart.style.background = conicGradientStr;
        // カラーパレットを描画
        colorList.forEach((color, index) => {
            const target: HTMLElement = document.querySelector(`.circle-graph-wrapper__color-list--color .color-view.color-index-${index}`) as HTMLElement;
            target.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`;
        })
    }, [degreeList, colorList])
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////////////////////////
    return (
        <div className="circle-graph-wrapper">
            <div className="circle-graph-wrapper__chart">

            </div>
            <ul className="circle-graph-wrapper__color-list">
                {colorList.map((color, index) => {
                    return (
                        <li className="circle-graph-wrapper__color-list--color" key={`circle-graph-wrapper__color-list--color#${index}`}>
                            <div className={`color-view color-index-${index}`}></div>
                            <p className="title">{userData.tasks.getTaskByID(props.idsArr[index])?.title}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
}