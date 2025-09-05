import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Grid";

function DrawerAppBar(props) {
  const { organizer, descp, date, restaurant, menuUrl } = props;

  return (
    <Box sx={{ display: "flex", backgroundColor: "rgba(0,145,90,1)", borderRadius: "4px", m: 4 }}>
      <Typography variant="h5" color="white" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" }, m: 4, fontWeight: "bold" }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            {descp}
          </Grid>
          <Grid item xs={4}>
            {date}
          </Grid>
          <Grid item xs={8}>
            {organizer}
          </Grid>
          <Grid item xs={4}>
            {restaurant}
          </Grid>
        </Grid>
      </Typography>

      <Box component="main" sx={{ p: 6 }}></Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
