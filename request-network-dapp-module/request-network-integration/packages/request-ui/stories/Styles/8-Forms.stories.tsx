import React from 'react';
import { TextField, Box, Typography } from '@material-ui/core';
export default {
  title: 'Styles',
};

export const Forms = () => {
  return (
    <Box width={532}>
      <p>
        <Typography>Empty field</Typography>
        <Box height={8} />
        <TextField
          name="field"
          label="Label"
          placeholder="Placeholder"
          fullWidth
          required
          helperText=" "
        />
      </p>
      <p>
        <Typography>Empty field, focused</Typography>
        <Box height={8} />
        <TextField
          autoFocus
          name="field"
          label="Label"
          placeholder="Placeholder"
          fullWidth
          required
          helperText=" "
        />
      </p>

      <p>
        <Typography>Empty field with error</Typography>
        <Box height={8} />
        <TextField
          name="field"
          label="Label"
          placeholder="Placeholder"
          fullWidth
          error
          helperText="This is an error"
        />
      </p>
      <p>
        <Typography>Field with value</Typography>
        <Box height={8} />
        <TextField
          name="field"
          label="Label"
          placeholder="Placeholder"
          value="Value"
          fullWidth
          required
          helperText=" "
        />
      </p>
      <p>
        <Typography>Field with error and value</Typography>
        <Box height={8} />
        <TextField
          name="field"
          label="Label"
          placeholder="Placeholder"
          value="Value"
          fullWidth
          error
          helperText="This is an error"
        />
      </p>
    </Box>
  );
};

Forms.story = {
  name: 'Forms',
};
