import Login    from "./Components/login/Login";
import Main     from "./Components/main/Main";
import Result   from "./Components/result/Result";
import Settings from "./Components/settings/Settings";
import { auth } from "./firebase";
import { ButtonList } from "./Components/common";
import { useState, createContext } from 'react';
import { CSSTransition } from "react-transition-group";
import { UserData } from "./Class";
import "./styles/Components/reset.scss";
import "./styles/Components/App.scss";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "./Components/loading/Loading";



const debugMode: boolean = false;
//////////////////////////////////////////////////////////////////
// global variables
//////////////////////////////////////////////////////////////////
const UserDataContext: React.Context<UserData> = createContext<UserData>(new UserData(debugMode));
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


function App() {
  //////////////////////////////////////////////////////////////////
  // login
  //////////////////////////////////////////////////////////////////
  const [userData, setuserData] = useState<UserData>(new UserData(debugMode));
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////






  //////////////////////////////////////////////////////////////////
  // page state
  //////////////////////////////////////////////////////////////////
  const [pageState, setPageState] = useState<"main" | "result" | "settings" | "login" | "loading">("login");
  onAuthStateChanged(auth, async(user) => {
    if (user) {
      if (!userData.user) {
        // デバッグがfalseの時にはデータをInit
        if (!debugMode) {
          setPageState("loading");
          const newData: UserData = new UserData(debugMode);
          await newData.setInitData(user);
          setuserData(newData);
          setTimeout(() => setPageState("main"), 1000);
        }
      }
    } else {
      setPageState("login");
    }
  })
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////






  //////////////////////////////////////////////////////////////////
  // left side render request
  //////////////////////////////////////////////////////////////////
  // [ページ名, コンポーネント識別用ID]で指定することによりleft-sideに任意のコンポーネントをレンダリングする.
  // コンポーネント識別用IDは-1だと何も表示しない.
  const [leftSideRender, setLeftSideRender] = useState<["main" | "result" | "settings" | "login" | "loading", number, JSX.Element]>([pageState, -1, <></>]);
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////






  //////////////////////////////////////////////////////////////////
  // render
  //////////////////////////////////////////////////////////////////
  return (
    <UserDataContext.Provider value={userData}>
        {pageState === "login" &&
          <div className="login-content">
            <Login
              setPageState = { setPageState }
              setuserData  = { setuserData }
            />
          </div>
        }






        {pageState === "loading" &&
          <div className="loading-content">
            <Loading/>
          </div>
        }






        {/* left side */}
        {(pageState !== "login" && pageState !== "loading") &&
          <div className="left-side-wrapper">
              {leftSideRender[1] !== -1 &&
                <>
                  {leftSideRender[2]}
                </>
              }
          </div>
        }






        {/* content */}
        {(pageState !== "login" && pageState !== "loading") &&
          <div className="content-wrapper">

            <CSSTransition
              in = { pageState === "main" }
              timeout = { 600 }
              unmountOnExit
            >
              <Main
                setLeftSideRender = {setLeftSideRender}
              />
            </CSSTransition>

            <CSSTransition
              in = { pageState === "result" }
              timeout = { 600 }
              unmountOnExit
            >
              <Result/>
            </CSSTransition>

            <CSSTransition
              in = { pageState === "settings" }
              timeout = { 600 }
              unmountOnExit
            >
              <Settings/>
            </CSSTransition>

          </div>
        }






        {/* right side */}
        {(pageState !== "login" && pageState !== "loading") &&
          <div className="right-side-wrapper">
            <div className="right-side-wrapper__button-list">
              <ButtonList
                setPageState = { setPageState }
              />
            </div>
          </div>
        }






        {/* bottom */}
        {(pageState !== "login" && pageState !== "loading") &&
          <div className="bottom-side-wrapper">
            <div className="right-side-wrapper__button-list">
              <ButtonList
                setPageState = { setPageState }
              />
            </div>
          </div>
        }
    </UserDataContext.Provider>
  );
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
}

export { App, UserDataContext };