import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Paper,
  Radio,
  FormControlLabel,
  RadioGroup,
  Button,
} from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import TestCaseRecordApi from "api/test_plan/testCaseRecord";

function AIComparisonPage() {
  const location = useLocation();
  const { data } = location.state || {};
  const history = useHistory();

  const item_id = location.state.data.item_id;
  const [userInput, setUserInput] = useState(data?.user_content || "");
  const [aiSuggestion, setAiSuggestion] = useState(data?.ai_suggestion || "");
  const [selectedOption, setSelectedOption] = useState("user");

  const handleUserInputChange = (event) => {
    const input = event.target.value;
    setUserInput(input);
    const aiResponse = `AI Suggestion for "${input}"`;
    setAiSuggestion(aiResponse);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSaveChange = async () => {
    if (selectedOption === "ai") {
      try {
        const response = await TestCaseRecordApi.update_case_record_ai_suggestion({
          item_id: item_id,
          description: data?.ai_suggestion,
        });
        console.log("response", response);
        history.push("/test_case_list");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ flexGrow: 1, overflow: "hidden", padding: 2 }}>
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", padding: 2 }}>
          <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Yours"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={10}
                  value={userInput}
                  onChange={handleUserInputChange}
                  sx={{ marginTop: 2 }}
                />
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="Use Yours"
                  sx={{ marginLeft: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="AI Suggestion"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={10}
                  value={aiSuggestion}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ marginTop: 2 }}
                />
                <FormControlLabel
                  value="ai"
                  control={<Radio />}
                  label="Use AI Suggestion"
                  sx={{ marginLeft: 1 }}
                />
              </Grid>
            </Grid>
          </RadioGroup>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" onClick={handleSaveChange}>
              Save This Change
            </Button>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}

export default AIComparisonPage;
