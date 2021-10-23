import { useState } from "react";
import { Paper, Container, Box, TextField, Button } from "@material-ui/core";
import web3 from "web3";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";

import { useAuthContext } from "@/contexts/auth";

import InputNumber from "./InputNumber";

interface TransactionError {
  code: number;
  message: string;
  stack?: string;
}

//const isTransactionError = (x: any): x is TransactionError => {
//  return typeof x.code === 'number'
//};

const schema = yup
  .object()
  .shape({
    address: yup
      .string()
      .test("addr", "This is not a valid address.", (s) => {
        if (s) {
          return web3.utils.isAddress(s);
        }
        return false;
      })
      .required("address is requried."),
    amount: yup.number().required("Amount is required").positive(),
  })
  .required();

const Body: React.FC = () => {
  const {
    state: { connected, account },
    library,
  } = useAuthContext();

  const { register, control, handleSubmit, errors, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: yupResolver(schema),
  });

  const { dirtyFields } = formState;

  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (
    { address, amount }: { address: string; amount: number },
    e: React.BaseSyntheticEvent | undefined
  ) => {
    if (e) {
      e.preventDefault();
    }
    setSubmitError("");
    try {
      const wallet_eth_amount = await library.eth.getBalance(account!);
      const send_eth_amount = web3.utils.toWei(amount.toString(), "ether");

      if (parseInt(wallet_eth_amount) < parseInt(send_eth_amount)) {
        setSubmitError("Insufficient funds");
        return;
      }

      const nonce = await library.eth.getTransactionCount(account!, "latest");

      setLoading(true);
      const sign = await library.eth.sendTransaction({
        from: account!,
        to: address,
        // faucet
        //to: "0x31B98D14007bDEe637298086988A0bBd31184523",
        value: send_eth_amount,
        nonce,
      });
      enqueueSnackbar("Operation Success", { variant: "success" });
    } catch (e) {
      console.log(e);
      if ((e as TransactionError).code === 4001) {
        setSubmitError("User cancelled");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Box position="relative">
          {!connected && (
            <Box
              position="absolute"
              top="0"
              bottom="0"
              left="0"
              right="0"
              bgcolor="rgba(0,0,0,0.2)"
              zIndex={2}
            />
          )}
          <Paper>
            <Box p={4}>
              <form>
                <Box my={1}>
                  <TextField
                    id="filled-full-width"
                    label="Send To"
                    style={{ margin: 8 }}
                    placeholder="Address"
                    helperText={errors.address?.message || " "}
                    fullWidth
                    error={!!errors.address}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    name="address"
                    inputRef={register}
                    variant="filled"
                  />
                </Box>
                <Box my={1}>
                  <Controller
                    render={({ onChange, value, onBlur }) => (
                      <InputNumber
                        onBlur={onBlur}
                        allowNegative={false}
                        onValueChange={(v) => {
                          onChange(v.floatValue);
                        }}
                        label="Amount"
                        error={!!errors.amount}
                        errorMsg={errors.amount?.message || " "}
                        value={value}
                      />
                    )}
                    name="amount"
                    defaultValue={null}
                    control={control}
                  />
                </Box>
                <Box textAlign="right">
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleSubmit(onSubmit)}
                      disabled={
                        Object.keys(dirtyFields).length !== 2 || loading
                      }
                    >
                      {loading ? "Sending" : "Send"}
                    </Button>
                  </Box>
                  <Box color="red" mt={2}>
                    {submitError}
                  </Box>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Body;
