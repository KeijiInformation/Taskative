import "../../styles/Components/loading/Loading.scss";



export default function Loading() {
    ///////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////
    return (
        <div className="loading-page-wrapper">
            <div className="loading-page-wrapper__message-box">
                <p className="loading-page-wrapper__message-box--message">データを取得しています。しばらくお待ちください。</p>
            </div>
            <div className="loading-page-wrapper__animation-box">
                
            </div>
        </div>
    )
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
}