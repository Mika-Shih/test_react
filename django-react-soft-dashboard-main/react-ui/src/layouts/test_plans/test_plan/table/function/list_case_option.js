import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import TOOLAPI from "api/tool";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function Asynchronous({ api, request, selectedOptions, setSelectedOptions }) {
  const [options, setOptions] = React.useState([]);
  const [versionData, setVersionData] = React.useState({}); // 存儲版本相關數據
  const loading = options.length === 0;
  const [numberOfOptions, setNumberOfOptions] = React.useState(selectedOptions.length || 1);
  const [openStates, setOpenStates] = React.useState(Array(numberOfOptions).fill(false));
  const prevSelectedOptions = React.useRef([]);
  React.useEffect(() => {
    if (selectedOptions.length > 0) {
      const updatedOptions = selectedOptions.map((option) => {
        if (option?.title && versionData[option.title]) {
          const matchingVersion = versionData[option.title].find(
            (v) => v.version === option.version
          );
          return matchingVersion
            ? {
                ...matchingVersion,
                description: matchingVersion.description || "No Description",
                comment: matchingVersion.comment || "No Comment",
              }
            : {
                ...option,
                description: option.description || "No Description",
                comment: option.comment || "No Comment",
              };
        }
        return {
          ...option,
          description: option.description || "No Description",
          comment: option.comment || "No Comment",
        };
      });

      if (JSON.stringify(updatedOptions) !== JSON.stringify(prevSelectedOptions.current)) {
        prevSelectedOptions.current = updatedOptions;
        setSelectedOptions(updatedOptions);
      }
    }
  }, [selectedOptions, versionData]);
  React.useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        await sleep(1000);

        let response;

        if (request) {
          response = await TOOLAPI.filter_post(api, request);
        } else {
          response = await TOOLAPI.filter_get(api);
        }

        const casesByParentId = {};
        response.data.finaldata
          .filter((item) => item.category === request.category)
          .forEach((item) => {
            const activeCases = item.data.filter((testCase) => testCase.case_status !== "delete");

            if (activeCases.length > 0) {
              const sortedCases = [...activeCases].sort((a, b) => b.case_id - a.case_id);
              const canonicalName = sortedCases[0].case_name;

              casesByParentId[item.id] = {
                id: item.id,
                tag: item.tag || "No Tag",
                canonicalName: canonicalName,
                cases: activeCases,
              };
            }
          });

        const filteredOptions = [];
        Object.keys(casesByParentId).forEach((parentId) => {
          const { tag, canonicalName, cases } = casesByParentId[parentId];

          const sortedCases = [...cases].sort((a, b) => a.case_id - b.case_id);

          const allCasesFromParent =
            response.data.finaldata.find((item) => item.id.toString() === parentId)?.data || [];

          const allSortedCases = [...allCasesFromParent].sort((a, b) => a.case_id - b.case_id);

          const versionMap = {};
          allSortedCases.forEach((testCase, index) => {
            versionMap[testCase.case_id] = `V.${index + 1}`;
          });

          sortedCases.forEach((testCase) => {
            filteredOptions.push({
              id: testCase.case_id,
              title: canonicalName,
              originalTitle: testCase.case_name,
              parentId: parseInt(parentId),
              tag: tag,
              description: testCase.description || "No Description",
              comment: testCase.comment || "No Comment",
              version: versionMap[testCase.case_id],
              rawData: testCase,
            });
          });
        });

        const versionMap = filteredOptions.reduce((acc, curr) => {
          acc[curr.title] = acc[curr.title] || [];
          acc[curr.title].push(curr);
          return acc;
        }, {});
        selectedOptions.forEach((option) => {
          if (option.title && !versionMap[option.title]) {
            versionMap[option.title] = [{ ...option, version: option.version || "N/A" }];
          } else if (option.title) {
            const existingVersions = versionMap[option.title] || [];
            if (!existingVersions.some((v) => v.version === option.version)) {
              versionMap[option.title].push(option);
            }
          }
        });
        const latestOptions = Object.values(versionMap).map(
          (versions) => versions[versions.length - 1]
        );

        if (active) {
          setOptions(latestOptions);
          setVersionData(versionMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [api, request, selectedOptions]);

  const handleAddOption = (indexToAdd) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions.splice(indexToAdd + 1, 0, { title: "", id: null });
    setSelectedOptions(updatedOptions);

    const updatedOpenStates = [...openStates];
    updatedOpenStates.splice(indexToAdd + 1, 0, false);
    setOpenStates(updatedOpenStates);

    setNumberOfOptions(updatedOptions.length);
  };

  const handleRemoveOption = (indexToRemove) => {
    const updatedOptions = selectedOptions.filter((_, index) => index !== indexToRemove);
    setSelectedOptions(updatedOptions);

    const updatedOpenStates = openStates.filter((_, index) => index !== indexToRemove);
    setOpenStates(updatedOpenStates);

    setNumberOfOptions(updatedOptions.length || 1);
  };

  const handleOpenChange = (index, isOpen) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = isOpen;
      return newState;
    });
  };

  const handleVersionChange = (index, version) => {
    const updatedOptions = [...selectedOptions];
    const currentTitle = selectedOptions[index]?.title;

    if (versionData[currentTitle]) {
      const selectedVersion = versionData[currentTitle].find((item) => item.version === version);
      if (selectedVersion && updatedOptions[index]?.version !== version) {
        updatedOptions[index] = {
          ...selectedVersion,
          description: selectedVersion.description || "No Description",
          comment: selectedVersion.comment || "No Comment",
        };
        setSelectedOptions(updatedOptions);
      }
    }
  };

  return (
    <div>
      {[...Array(numberOfOptions)].map((_, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* 下拉選單 */}
            <Autocomplete
              id={`asynchronous-demo-${index}`}
              sx={{ width: 400 }}
              open={openStates[index]}
              onOpen={() => handleOpenChange(index, true)}
              onClose={() => handleOpenChange(index, false)}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              getOptionLabel={(option) =>
                `${option?.title || ""}${option?.version ? ` (${option.version})` : ""}`
              }
              options={options.filter(
                (option) =>
                  // Keep options that are already selected in the current field
                  selectedOptions[index]?.id === option.id ||
                  // Filter out options that are selected in other fields
                  !selectedOptions.some(
                    (selectedOption) => selectedOption?.id === option.id && option.id !== null
                  )
              )}
              loading={loading}
              value={selectedOptions[index] || { title: "", id: null }}
              onChange={(event, newValue) => {
                const updatedOptions = [...selectedOptions];
                updatedOptions[index] = newValue || { title: "", id: null };
                setSelectedOptions(updatedOptions);
              }}
              filterOptions={(opts, { inputValue }) => {
                const searchTerm = inputValue.toLowerCase();
                return opts.filter((option) =>
                  ["id", "title", "tag", "description", "comment", "version"].some((field) => {
                    const fieldValue = option[field]?.toString().toLowerCase();
                    return fieldValue && fieldValue.includes(searchTerm);
                  })
                );
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <Tooltip
                    title={
                      <div style={{ textAlign: "left", lineHeight: "1.5" }}>
                        <div>
                          <strong>ID:</strong> {option.id}
                        </div>
                        <div>
                          <strong>Name:</strong> {option.title || ""}
                        </div>
                        <div>
                          <strong>Description:</strong> {option.description || "No Description"}
                        </div>
                        <div>
                          <strong>Comment:</strong> {option.comment || "No Comment"}
                        </div>
                      </div>
                    }
                    componentsProps={{
                      tooltip: {
                        sx: {
                          maxWidth: "250px",
                          textAlign: "left",
                          backgroundColor: "#222",
                          color: "#fff",
                          fontSize: "14px",
                          padding: "10px",
                          lineHeight: "1.5",
                        },
                      },
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span>
                        {option.title}
                        {option.version ? ` (${option.version})` : ""}
                      </span>
                      <span style={{ fontSize: "12px", color: "#888" }}>{option.tag}</span>
                    </div>
                  </Tooltip>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* 版本選擇容器 */}
            {selectedOptions[index]?.title && versionData[selectedOptions[index].title] && (
              <Tooltip
                title={
                  <div style={{ textAlign: "left", lineHeight: "1.5" }}>
                    <div>
                      <strong>ID:</strong> {selectedOptions[index]?.id || "N/A"}
                    </div>
                    <div>
                      <strong>Name:</strong> {selectedOptions[index]?.title || "No Name"}
                    </div>
                    <div>
                      <strong>Description:</strong>{" "}
                      {selectedOptions[index]?.description ?? "No Description"}
                    </div>
                    <div>
                      <strong>Comment:</strong> {selectedOptions[index]?.comment ?? "No Comment"}
                    </div>
                  </div>
                }
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      maxWidth: "250px",
                      textAlign: "left",
                      backgroundColor: "#222",
                      color: "#fff",
                      fontSize: "14px",
                      padding: "10px",
                      lineHeight: "1.5",
                    },
                  },
                }}
              >
                <Select
                  value={selectedOptions[index]?.version || ""}
                  onChange={(e) => handleVersionChange(index, e.target.value)}
                  disabled={!versionData[selectedOptions[index]?.title]} // 當 versionData 沒有該測試案例時禁用
                  style={{
                    maxWidth: "80px",
                    height: "40px",
                    fontSize: "14px",
                  }}
                  MenuProps={{
                    MenuListProps: {
                      style: {
                        maxHeight: "200px",
                        width: "200px",
                      },
                    },
                  }}
                >
                  {versionData[selectedOptions[index]?.title]?.map((versionItem) => (
                    <MenuItem
                      key={versionItem.version}
                      value={versionItem.version}
                      style={{
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      {versionItem.version}
                    </MenuItem>
                  )) || []}
                </Select>
              </Tooltip>
            )}

            {/* 按鈕容器 */}
            <div style={{ display: "flex", gap: "4px" }}>
              <IconButton onClick={() => handleAddOption(index)}>
                <AddIcon />
              </IconButton>
              {numberOfOptions > 1 && (
                <IconButton onClick={() => handleRemoveOption(index)}>
                  <RemoveIcon />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Asynchronous.propTypes = {
  api: PropTypes.string.isRequired,
  request: PropTypes.object.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};
