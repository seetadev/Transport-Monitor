import React from "react";
import { makeStyles, Typography, Theme } from "@material-ui/core";

const useFilterStyles = makeStyles<Theme, { active: boolean }>(theme => ({
  root: {
    height: 56,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: ({ active }) => (active ? "#00CC8E" : "#1A1A1A"),
    borderBottom: ({ active }) => `1px solid ${active ? "#00CC8E" : "#C7C7C7"}`,
    cursor: "pointer",
    flex: 1,
    [theme.breakpoints.up("sm")]: {
      flex: "unset",
    },
  },
  item: {
    padding: "16px 24px",
  },
}));

export const Filter = ({
  name,
  active,
  select,
}: {
  name: string;
  active: boolean;
  select: () => void;
}) => {
  const classes = useFilterStyles({ active });
  return (
    <div className={classes.root} onClick={select}>
      <Typography className={classes.item} variant="h4">
        {name}
      </Typography>
    </div>
  );
};
