import React, { useState } from "react";
import {
  TextField,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  Modal,
  Button,
  InputLabel,
  styled,
  Grid,
} from "@mui/material";
import { CHECKS_URL } from "../utils/constant";

interface AddCheckProps {
  open: boolean;
  onClose: () => void;
  fetchCheckList: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  width: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const StyledMenuItem = styled(MenuItem)(({ theme, selected }) => ({
  color: selected ? theme.palette.success.dark : "inherit",
  "&:hover": {
    color: selected ? theme.palette.action.hover : theme.palette.success.dark,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    color: theme.palette.success.main,
  },
}));

const CHECK_TYPES = ["HTTPS(s)"];
const STATUS_CODES = ["200", "201", "[200 - 299]"];
const METHODS = ["GET", "POST", "PUT", "DELETE"];

// ensure that numeric value are passed to inputs
const numericValue = (value: string) => value.replace(/[^0-9]/g, "");

const AddCheck: React.FC<AddCheckProps> = ({
  open,
  onClose,
  fetchCheckList,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setURL] = useState<string>("");
  const [requestInterval, setRequestInterval] = useState<string>("5");
  const [maxRetries, setMaxReties] = useState<string>("20");
  const [selectedCheckType, setSelectedCheckType] =
    useState<string>("HTTPS(s)");
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<string[]>([
    "[200 - 299]",
  ]);
  const [selectedMethod, setSelectedMethod] = useState<string>("GET");
  const [body, setBody] = useState<string>("");
  const [headers, setHeaders] = useState<string>("");
  const [invalidJSONBody, setInvalidJSONBody] = useState<boolean>(false);
  const [invalidJSONHeaders, setInvalidJSONHeaders] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setURL(event.target.value);
  };

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestInterval(numericValue(event.target.value));
  };

  const handleMaxRetriesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaxReties(numericValue(event.target.value));
  };

  const handleCheckTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedCheckType(event.target.value);
  };

  const handleStatusCodesChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedStatusCodes(event.target.value as string[]);
  };

  const handleMethodChange = (event: SelectChangeEvent<string>) => {
    setSelectedMethod(event.target.value);
  };

  const validateJSON = (
    JSONValue: string,
    setInvalidJSON: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      JSON.parse(JSONValue);
      setInvalidJSON(false);
    } catch (error) {
      setInvalidJSON(true);
    }
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setBody(inputValue);
    validateJSON(inputValue, setInvalidJSONBody);
  };

  const handleHeadersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setHeaders(inputValue);
    validateJSON(inputValue, setInvalidJSONHeaders);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!invalidJSONBody || !invalidJSONHeaders) {
      const jsonData = {
        target: {
          domain_name: url,
        },
        name,
        data: {
          description,
          interval: requestInterval,
          headers,
          maxRetries,
          check_type: selectedCheckType,
          status_code: selectedStatusCodes,
          method: selectedMethod,
          body,
          podName: `probing-${name.replace(/\s/g, "").toLowerCase()}`,
        },
      };
      try {
        const response = await fetch(CHECKS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Response:", responseData);
        } else {
          console.error("Error:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      resetFieldsAndClose();
      fetchCheckList();
    }
  };

  const resetFields = () => {
    setName("");
    setDescription("");
    setURL("");
    setRequestInterval("5");
    setMaxReties("20");
    setSelectedCheckType("HTTPS(s)");
    setSelectedStatusCodes(["[200 - 299]"]);
    setSelectedMethod("GET");
    setBody("");
    setHeaders("");
    setInvalidJSONBody(false);
    setInvalidJSONHeaders(false);
  };

  const resetFieldsAndClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputLabel>Check type</InputLabel>
              <Select
                value={selectedCheckType}
                onChange={handleCheckTypeChange}
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 1 }}
                required
              >
                {CHECK_TYPES.map((checkType) => (
                  <MenuItem key={checkType} value={checkType}>
                    {checkType}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={handleNameChange}
                required
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={handleDescriptionChange}
              />

              <TextField
                label="URL"
                variant="outlined"
                fullWidth
                margin="normal"
                value={url}
                onChange={handleURLChange}
                required
              />
              <TextField
                type="number"
                label="Interval"
                variant="outlined"
                fullWidth
                margin="normal"
                value={requestInterval}
                onChange={handleIntervalChange}
              />
              <TextField
                type="number"
                label="Max retries"
                variant="outlined"
                fullWidth
                margin="normal"
                value={maxRetries}
                onChange={handleMaxRetriesChange}
              />
              <InputLabel>Status code</InputLabel>
              <StyledSelect
                multiple
                value={selectedStatusCodes}
                onChange={
                  handleStatusCodesChange as (
                    event: SelectChangeEvent<unknown>
                  ) => void
                }
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 1 }}
              >
                {STATUS_CODES.map((statusCode) => (
                  <StyledMenuItem
                    key={statusCode}
                    value={statusCode}
                    selected={selectedStatusCodes.includes(statusCode)}
                  >
                    {statusCode}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel>Method</InputLabel>
              <Select
                value={selectedMethod}
                onChange={handleMethodChange}
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 1 }}
              >
                {METHODS.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Body"
                variant="outlined"
                fullWidth
                margin="normal"
                value={body}
                onChange={handleBodyChange}
                multiline
                rows={4}
                error={invalidJSONBody}
                helperText={
                  invalidJSONBody ? "Invalid JSON format" : "Enter valid JSON"
                }
              />
              <TextField
                label="Headers"
                variant="outlined"
                fullWidth
                margin="normal"
                value={headers}
                onChange={handleHeadersChange}
                multiline
                rows={4}
                error={invalidJSONHeaders}
                helperText={
                  invalidJSONHeaders
                    ? "Invalid JSON format"
                    : "Enter valid JSON"
                }
              />
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" color="success">
            Add
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={resetFields}
            sx={{ marginLeft: "16px" }}
          >
            Rest
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCheck;
