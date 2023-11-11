import { useState } from 'react';

const SplitCellSelectMenu = () => {
  // State to manage the selected value
  const [splitCellSelectedValue, setSplitCellSelectedValue] = useState('');

  // Handler for select change
  const handleSplitCellSelectChange = (event) => {
    setSplitCellSelectedValue(event.target.value);
  };

  return (
    <div>
      <label htmlFor="selectOption">Split cell into:</label>
      <select id="selectOption" value={splitCellSelectedValue} onChange={handleSplitCellSelectChange}>
        <option value="rows">rows</option>
        <option value="cols1">cols</option>
      </select>

      {/* <p>Selected Option: {selectedValue}</p> */}
    </div>
  );
};

export default SplitCellSelectMenu;