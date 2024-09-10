import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
function MyTableCell({ row_style, data }) {
  return (
    <>
      <TableRow className={row_style}>
        {data &&
          data.map((item, index) => (
            <TableCell key={index} className={item.style}>
              {item.children}
            </TableCell>
          ))}
      </TableRow>
    </>
  );
}

MyTableCell.propTypes = {
  row_style: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      style: PropTypes.string,
      children: PropTypes.node.isRequired,
    })
  ).isRequired,
};
export default MyTableCell;
