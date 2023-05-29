import React from 'react';
import Typography from '@material-ui/core/Typography';

export default {
  title: 'Styles',
};

const styles: any[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'caption',
  'body2',
  'body1',
];

export const TextStory = () => {
  return (
    <table>
      {styles.map(style => (
        <tr>
          <th>{style}</th>
          <td>
            <Typography variant={style}>
              I watched the storm, so beautiful yet terrific.
            </Typography>
          </td>
        </tr>
      ))}
    </table>
  );
};

TextStory.story = {
  name: 'Typography',
};
