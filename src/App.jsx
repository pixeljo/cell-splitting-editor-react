import { useState } from 'react'
import './App.scss'

function App() {
  const [imageCells, setImageCells] = useState([
    { id: 1, 
      imgUrl: 'https://media.nga.gov/iiif/a8c923e1-078d-4f94-b1f4-0e303afe2155/full/!740,560/0/default.jpg',
      imgAlt: 'painting by Rothko abstract with shades of yellow and orange'
     },
    { id: 2, 
      imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9OUHCCZD-mGE1nt0-IKYFb39Cu--s2yvYrq-0oyN8WIpd6dRBNjrL7nzAuQGyDwMIo3g&usqp=CAU',
      imgAlt: '' 
    },
    { id: 3, 
      imgUrl: 'https://miro.medium.com/v2/resize:fit:0/1*OPTDa-ekwUOSpE3QvjZTeg.jpeg',
      imgAlt: '' },
    // Add more cells as needed
  ]);
  let containerId = 0;
  let cellId = 1;

  // State hooks
  const [cellLayout, setCellLayout] = useState([
    // <div key={1} className="cell-container">
    //   <div className="cell" onClick={handleSplitCell}></div>
    // </div>,
    // Add more initial cells as needed
  ]);

  const [layouts, setLayouts] = useState(["new"]);
  const [selectedLayout, setSelectedLayout] = ("new");

  // Event handlers
  const handleAddCell = () => {
    // setCellLayout((prevLayout) => [
    //   ...prevLayout,
    //   <div key={prevLayout.length + 1} className="cell-container">
    //     <div className="cell" onClick={handleSplitCell}></div>
    //   </div>,
    // ]);
  };

  const handleNewLayout = () => {
    setCellLayout([
      // <div key={1} className="cell-container">
      //   <div className="cell" onClick={handleSplitCell}></div>
      // </div>,
      // Add more initial cells as needed
    ]);
  };

  const loadLayout = () => {
    // Load layout logic here
  };

  const handleSaveLayout = () => {
    // Save layout logic here
  };

  const handleSplitCell = (cellId) => {
    // Split cell logic here
  };




  return (
    <>
      <div className="editor">
        <div className="action-area">
          <button className="btn--add-cell" onClick={handleAddCell}>
            Add Layout cell
          </button>
          <button className="btn--save-layout" onClick={handleSaveLayout}>
            Save Layout
          </button>
          {/* <button className="btn--new-layout" onClick={handleNewLayout}>
            New Layout
          </button> */}

          <label htmlFor="layout-select">Load:</label>
          <select
            name="load-layouts"
            id="layout-select"
            onChange={loadLayout}
            value={selectedLayout}
          >
            <option value="">Please choose a layout</option>
            {layouts.map((layout) => (
              <option key={layout} value={layout}>
                {layout}
              </option>
            ))}
          </select>
          <form id="cell-split-mode">
            <fieldset>
              <legend>Cell Split Mode:</legend>
              <div>
                <input
                  type="radio"
                  id="splitRow"
                  name="cellSplit"
                  value="row"
                  checked
                />
                <label htmlFor="splitRow">Into Rows</label>

                <input
                  type="radio"
                  id="splitCol"
                  name="cellSplit"
                  value="col"
                />
                <label htmlFor="splitCol">Into Cols</label>
              </div>
            </fieldset>
          </form>


        </div> {/* end action-area  */}
        <div className="edit-area">
          <div className="image-panel">
            <h2>Drag and Drop Images</h2>
            <div className="image-cells">
              {imageCells.map((cell) => (
                <div
                  key={cell.id}
                  className="image-cell" // Add your CSS class for image cells here
                  // onDragStart={(e) => handleDragStartCopy(e, cell.id)}
                  // onDragOver={(e) => handleDragOver(e, cell.id)}
                  // onDrop={(e) => handleDrop(e, cell.id)}
                  draggable
                  data-drag-type='copy'
                ><img src={cell.imgUrl} alt={cell.imgAlt}/></div>
              ))}
            </div>

          </div>
          <div className="layout-panel">
            <h2>Splitting Cells</h2>
            <div className="cell-layout-panel">
              {/* {cellLayout1.map((cellContainer) => (
                <div key={cellContainer.containerId} className="cell-container">
                  <Cell cellTree={cellContainer.containerChild} />
                </div>
                )
              )} */}
            </div>

          </div>
        </div>
        
      </div>
      
    </>
  )
}

export default App
