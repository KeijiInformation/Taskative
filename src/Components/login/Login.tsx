import { auth, provider } from "../../firebase";
import { signInWithRedirect } from "firebase/auth";
import { NormalBtn } from "../common";
import { UserData } from "../../Class";
import "../../styles/Components/login/Login.scss";



interface Props {
    setPageState: (pageState: "main" | "result" | "settings" | "login") => void;
    setuserData: (userData: UserData) => void;
}



export default function Login(props: Props) {
    ////////////////////////////////////////////////////////////////////
    // login
    ////////////////////////////////////////////////////////////////////
    function handleLogin(): boolean {
        signInWithRedirect(auth, provider).then(result => {
            return true;
        }).catch(error => {
            console.log(error.message);
            return false;
        })
        return true;
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////////
    return (
        <div className="login-page-wrapper">
            <p className="login-page-wrapper__first-view-message">ようこそ、Taskativeへ</p>
            {/* <p className="login-page-wrapper__operation-message">ログインしてください</p> */}
            <NormalBtn
                text = "ログインする"
                callback = {handleLogin}
            />
            <p className="login-page-wrapper__annotate-message">Googleアカウントを使用します。</p>
        </div>
    )
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
}