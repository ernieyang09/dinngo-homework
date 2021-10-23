import { useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import { createContext, useState, useContext, useMemo } from "react";
import { useSnackbar } from "notistack";

type KeysWithValsOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: P;
};

interface AuthContextState {
  connected: boolean;
  loading: boolean;
  account?: string | null;
}

interface AuthContextProviderStore {
  state: AuthContextState;
  library: Web3;
  onLogin: () => void;
  onLogout: () => void;
}

const AuthContext = createContext({} as AuthContextProviderStore);

const AuthContextProvider: React.FC = ({ children }) => {
  const { active, account, library, activate, error, deactivate } =
    useWeb3React();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const injected = new InjectedConnector({
    supportedChainIds: [3],
  });

  const onLogin = async () => {
    try {
      setLoading(true);
      await activate(injected);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    try {
      setLoading(true);
      await deactivate();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const state = {
    connected: active,
    account,
    loading,
  };

  const authDataValue = useMemo(
    () => ({
      state,
      library,
      onLogin,
      onLogout,
    }),
    [state]
  );

  useEffect(() => {
    if (error) {
      let errMsg;
      if (error instanceof UnsupportedChainIdError) {
        errMsg = "Unsupported Chain";
      } else {
        errMsg = "Unknown Error";
      }
      enqueueSnackbar(errMsg, { variant: "error" });
    }
  }, [error]);

  return (
    <AuthContext.Provider value={authDataValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const AuthContextConsumer = AuthContext.Consumer;
export const useAuthContext = () => useContext(AuthContext);
