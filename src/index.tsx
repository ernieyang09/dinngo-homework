//@ts-nocheck
import { useRef } from "react";
import ReactDOM from "react-dom";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import { provider } from "web3-core/types";
import AuthContextProvider from "./contexts/auth";
import { Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { SnackbarProvider } from "notistack";
import Main from "./main";

const getLibrary = (provider: provider) => {
  return new Web3(provider);
};

const App = () => {
  const notistackRef = useRef();
  const onClickDismiss = (key: string) => () => {
    //@ts-ignore
    notistackRef.current.closeSnackbar(key);
  };
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <CssBaseline />
      <SnackbarProvider
        ref={notistackRef}
        action={(key) => <Button onClick={onClickDismiss(key)}>Got it</Button>}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <AuthContextProvider>
          <Main />
        </AuthContextProvider>
      </SnackbarProvider>
    </Web3ReactProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
