import { TextField } from "@material-ui/core";
import NumberFormat, { NumberFormatProps } from "react-number-format";

// Can extract as a base input
const TempInput = ({ error, errorMsg, ...props }: any) => {
  return (
    <TextField
      {...props}
      style={{ margin: 8 }}
      placeholder="0.0"
      helperText={errorMsg}
      fullWidth
      error={error}
      margin="normal"
      InputLabelProps={{
        shrink: true,
      }}
      variant="filled"
    />
  );
};

const InputNumber: React.FC<NumberFormatProps> = ({
  name,
  value,
  onValueChange,
  ...props
}) => {
  return (
    <div>
      <NumberFormat
        {...props}
        allowNegative={false}
        decimalScale={7}
        name={name}
        value={value}
        onValueChange={onValueChange}
        customInput={TempInput}
      />
    </div>
  );
};
export default InputNumber;
