import FaceIcon from "@material-ui/icons/Face";
import copy from "copy-to-clipboard";

import { useAuthContext } from "@/contexts/auth";
import { Box, Chip, Button } from "@material-ui/core";

const Nav: React.FC = () => {
  const { state, onLogin, onLogout } = useAuthContext();
  const { connected, account } = state;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      marginY={2}
    >
      <Box mr={4}>
        <Chip
          style={{
            maxWidth: "160px",
          }}
          icon={<FaceIcon />}
          onClick={
            account
              ? () => {
                  copy(account);
                }
              : undefined
          }
          label={account}
        ></Chip>
      </Box>
      <Box flexBasis="120px">
        <Box textAlign="right">
          {!connected ? (
            <Button onClick={onLogin} variant="contained" color="primary">
              Login
            </Button>
          ) : (
            <Button onClick={onLogout} variant="contained" color="secondary">
              Log out
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Nav;
