import * as React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";

const styles = (theme) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  headerColumnCenter: {
    textAlign: "center !important",
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      ...(theme.direction === "rtl" && {
        paddingLeft: "0 !important",
      }),
      ...(theme.direction !== "rtl" && {
        paddingRight: undefined,
      }),
    },
  },
  tableRow: {
    cursor: "pointer",
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: "initial",
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? "center" : "center"}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight, textAlign: "center" }}
        align={columns[columnIndex].numeric || false ? "center" : "center"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight}
            className={classes.table}
            overflowX="auto"
            autoContainerWidth
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    })
  ).isRequired,
  headerHeight: PropTypes.string,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.string,
};

const defaultTheme = createTheme();
const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);

export default function ReactVirtualizedTable({ rows }) {
  console.log(rows);
  ReactVirtualizedTable.propTypes = {
    rows: PropTypes.array.isRequired,
  };
  return (
    <Paper style={{ height: 400, width: "100%", maxWidth: 1500, minWidth: 1500 }}>
      <VirtualizedTable
        overflowX="auto"
        rows={rows}
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={[
          {
            width: 150,
            label: "platform",
            dataKey: "platform",
            numeric: true,
          },
          {
            width: 80,
            label: "phase",
            dataKey: "phase",
            numeric: true,
          },
          {
            width: 80,
            label: "target",
            dataKey: "target",
            numeric: true,
          },
          {
            width: 150,
            label: "group",
            dataKey: "group",
            numeric: true,
          },
          {
            width: 120,
            label: "cycle",
            dataKey: "cycle",
            numeric: true,
          },
          {
            width: 60,
            label: "sku",
            dataKey: "sku",
            numeric: true,
          },
          {
            width: 200,
            label: "sn",
            dataKey: "sn",
            numeric: true,
          },
          {
            width: 120,
            label: "borrower",
            dataKey: "borrower",
            numeric: true,
          },
          {
            width: 120,
            label: "status",
            dataKey: "status",
            numeric: "text",
          },
          {
            width: 60,
            label: "position",
            dataKey: "position",
          },
          {
            width: 120,
            label: "remark",
            dataKey: "remark",
          },
          {
            width: 300,
            label: "update_time",
            dataKey: "update_time",
          },
        ]}
      />
    </Paper>
  );
}
