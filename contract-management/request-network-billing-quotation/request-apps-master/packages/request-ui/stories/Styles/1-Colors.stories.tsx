import React from 'react';
import { colors } from '../../';

export default {
  title: 'Styles',
};

const ColorDiv = ({ color }: { color: string }) => (
  <div
    style={{
      width: 169,
      height: 77,
      backgroundColor: colors[color],
    }}
  />
);

export const ColorStory = () => {
  return (
    <table>
      {Object.keys(colors).map(color => (
        <tr>
          <th>{color}</th>
          <td>
            <ColorDiv color={color} />
          </td>
        </tr>
      ))}
    </table>
  );
};

ColorStory.story = {
  name: 'Colors',
};
