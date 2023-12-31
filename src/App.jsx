import { useState } from 'react'
import './App.scss'

let containerIdCount = 0;
let cellIdCount = 100;

// TODO: is there any way to break down any of these components into
// a separate component that can be imported here.  They all seem to be 
// inter-related?  Maybe this can be organized better, so that we can
// have more modular, stand-alone components

function App() {
  // State hooks

  //TODO - don't think we need a state hook for this.
  // but it might be worth keeping it as a state, if we want to
  // add a feature that allows the user to dynamically upload
  // images to the image panel.
  const [imageCells, setImageCells] = useState([
    {
      id: 'img100',
      imgUrl: 'https://media.nga.gov/iiif/a8c923e1-078d-4f94-b1f4-0e303afe2155/full/!740,560/0/default.jpg',
      imgAlt: 'painting by Rothko abstract with shades of yellow and orange'
    },
    {
      id: 'img101',
      imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9OUHCCZD-mGE1nt0-IKYFb39Cu--s2yvYrq-0oyN8WIpd6dRBNjrL7nzAuQGyDwMIo3g&usqp=CAU',
      imgAlt: ''
    },
    {
      id: 'img103',
      imgUrl: 'https://miro.medium.com/v2/resize:fit:0/1*OPTDa-ekwUOSpE3QvjZTeg.jpeg',
      imgAlt: ''
    },
    // Add more cells as needed
  ]);

  // State hooks

  //TODO see if there is a better way to do this - e.g. less code inside a loop.
  // State to maintian the cells in the Cell layout panel
  const [cellLayout, setCellLayout] = useState([
    {
      containerId: ++containerIdCount,
      containerChild:
      {
        cellId: ++cellIdCount,
        classType: "cell",
        isClickable: true,
      }
    },
    {
      containerId: ++containerIdCount,
      containerChild:
      {
        cellId: ++cellIdCount,
        classType: "cell",
        isClickable: true,
      }
    },
    {
      containerId: ++containerIdCount,
      containerChild:
      {
        cellId: ++cellIdCount,
        classType: "cell",
        isClickable: true,
      }
    },
    {
      containerId: ++containerIdCount,
      containerChild:
      {
        cellId: ++cellIdCount,
        classType: "cell",
        isClickable: true,
      }
    }
  ]);
  // States to manage Load layout select menu
  const [selectedLayoutValue, setSelectedLayoutValue] = useState('new');
  const [layoutOptions, setLayoutOptions] = useState([
    { value: 'new', label: 'new' },
  ]);
  // State to manage the split cell selected value
  const [splitCellSelectedValue, setSplitCellSelectedValue] = useState('rows');

  //
  // Event handlers
  //
  // handleAddCell
  // Adds new Container cell to the cell layout panel
  const handleAddCell = () => {
    containerIdCount += 1;
    cellIdCount += 1;

    // TODO - spread operator/shallow copy could be a problem?
    setCellLayout((prevLayout) => [
      ...prevLayout,
      {
        containerId: containerIdCount,
        containerChild:
        {
          cellId: cellIdCount,
          classType: "cell",
          isClickable: true,
        }
      }
    ]);
  };

  //
  // loadLayout
  // Updates the cell panel to contain the layout selected from
  // the load select menu.
  const loadLayout = (evt) => {

    const loadSelection = evt.target.value;
    setSelectedLayoutValue(loadSelection);

    if (loadSelection === "new") {
      // Clear current layout and set up 4 empty cells
      const newLayout = [];
      // TODO these count numbers seem too high - need to explore
      // keep logs for now.
      // console.log("current containerIdCount: ", containerIdCount);
      // console.log("current cellIdCount: ", cellIdCount);
      for (let i = 0; i < 4; i++) {
        newLayout.push(
          {
            containerId: ++containerIdCount,
            containerChild:
            {
              cellId: ++cellIdCount,
              classType: "cell",
              isClickable: true,
            }
          }
        )
      }
      setCellLayout(newLayout);
    } else {
      //Retrieve saved layout
      const serializedLayout = localStorage.getItem(loadSelection);

      if (serializedLayout) {
        try {
          const stateFromLocalStorage = JSON.parse(serializedLayout);

          // Update the existing state with the state from local storage
          // TODO-learn:I'm not sure why I have to have the .cellLayout object.
          // Why can't I do the following?
          //setCellLayout(stateFromLocalStorage);
          setCellLayout(stateFromLocalStorage.cellLayout);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
  };

  //
  // handleSaveLayout
  // Prompts the user for a name to save the layout to
  // Saves current cell layout to local storage
  //
  const handleSaveLayout = () => {
    const newLayoutName = prompt("Please enter a name for the layout:");

    if (newLayoutName) {
      // add new name to the Load select menu
      const newLoadOption = { value: newLayoutName, label: `(${newLayoutName})` };
      setLayoutOptions([...layoutOptions, newLoadOption]);
      setSelectedLayoutValue(newLayoutName);

      // TODO-learn:
      // const currentCellLayout = {cellLayout}; // do I need to make a deep copy first?
      // const serializedLayout = JSON.stringify(currentCellLayout); // do I need 2 steps?
      const serializedLayout = JSON.stringify({ cellLayout });
      localStorage.setItem(newLayoutName, serializedLayout);
    }
  };

  //
  //Drag and drop event handlers
  //

  function handleDragStart(evt, sourceId, sourceImgId) {
    // If source is an image from the image panel then set it up
    // to be copied, otherwise we'll swap images between the target 
    // and the source
    const expression = /^img/;
    const dragData = {
      sourceId: sourceId,
      sourceImgId: sourceImgId
    }
    // If source is from the image palette, then set it up to be copied.
    // Otherwise the source is in the cell layout palette, and images will be swapped.
    evt.dataTransfer.effectAllowed = (expression.test(sourceId)) ? 'copy' : 'move'
    evt.dataTransfer.setData('text', JSON.stringify(dragData));

    evt.target.classList.add('fade');
  }

  function handleDragOver(evt) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    return false;
  }

  function handleDragEnter(evt) {
    evt.target.classList.add('over');
  }

  function handleDragLeave(evt) {
    evt.target.classList.remove('over');
  }

  function handleDragEnd(evt) {
    evt.target.classList.remove('fade');
  }


  function handleDrop(evt, targetId, targetImgId) {
    evt.preventDefault();

    let dragData;

    try {
      dragData = JSON.parse(evt.dataTransfer.getData('text'));
    } catch (e) {
      // If the text data isn't parsable we'll just ignore it.
      return;
    }

    const sourceId = dragData.sourceId;
    const sourceImgId = dragData.sourceImgId;

    // if transfer allowed is copy, replace image for target cell
    // otherwise swap images between source and target cells

    const tempLayout = JSON.parse(JSON.stringify({ cellLayout })); //deep copy

    // copy source image to target cell
    tempLayout.cellLayout.forEach((cellContainer) => {
      updateCellContent(cellContainer.containerChild, targetId, sourceImgId);
    }
    );

    if (evt.dataTransfer.effectAllowed === 'move') {
      //swap images - replace source image with target image
      tempLayout.cellLayout.forEach((cellContainer) => {
        updateCellContent(cellContainer.containerChild, sourceId, targetImgId);
      }
      );
    }

    setCellLayout(JSON.parse(JSON.stringify(tempLayout.cellLayout)));
  }


  // 
  // handleSplitCellSelectChange
  // 
  const handleSplitCellSelectChange = (event) => {
    setSplitCellSelectedValue(event.target.value);
  };

  const handleSplitCell = (evt, id) => {

    const splitState = (splitCellSelectedValue === "cols") ? "cell-cols" : "cell-rows"
    const tempLayout = JSON.parse(JSON.stringify({ cellLayout }));

    let found = false;
    tempLayout.cellLayout.forEach((cellContainer) => {
      if (formatData(cellContainer.containerChild, id, splitState)) { found = true; }
    }
    );

    setCellLayout(JSON.parse(JSON.stringify(tempLayout.cellLayout)));

  };

  //
  //Support functions
  //

  //
  //updateCellContent
  // Recursively search a binary tree, cellTree for cellId.
  // If found update the cell content to newContent
  // Inputs:
  // cellTree - an object containing all of the cells (nested binary tree)within a cell container
  // cellId - the id number of the cell we are searching for.
  // newContent - the id number of the image to be placed in the found cell.
  // returns boolean - true if cell found, false otherwise
  function updateCellContent(cellTree, cellId, newContent) {

    if (!cellTree) {
      return false;
    }

    if (cellTree.cellId === cellId) {
      cellTree.cellContent = newContent;
      return (true);
    } else {
      {
        cellTree?.cellChildren?.forEach((child) => {
          updateCellContent(child, cellId, newContent);
        }
        )
      }
    }

  }

  //
  // formatData - used for cell-splitting functionality
  // If cell with cellId found:
  // Adds 2 new child cells to current cellId cell,
  // updates current cell to be non-clickable,
  // and transfers image from original cell to the 2 new child cells
  // Inputs
  // cellTree - an object containing all of the cells (nested binary tree)within a cell container
  // cellId - the id number of the cell we are searching for.
  // cellClassType - the class name ('cell-cols' or 'cell-rows') for the cellId which will be a parent to the 2 new cells
  // returns boolean - true if cell found, false otherwise.
  // 
  function formatData(cellTree, cellId, cellClassType) {

    if (!cellTree) { return false }

    cellIdCount += 1;
    const childId1 = cellIdCount;
    cellIdCount += 1;
    const childId2 = cellIdCount;
    const currentContent = (cellTree.cellContent) ? cellTree.cellContent : null;
    if (cellTree.cellId === cellId) {
      cellTree.classType = cellClassType;
      cellTree.isClickable = false;
      cellTree.cellChildren = [{
        cellId: childId1,
        classType: "cell",
        isClickable: true,
        cellContent: currentContent,
      },
      {
        cellId: childId2,
        classType: "cell",
        isClickable: true,
        cellContent: currentContent,
      }
      ];
      cellTree.cellContent = null;
      return true;
    } else {
      let found = false;
      {
        cellTree?.cellChildren?.map((child) => {
          if (formatData(child, cellId, cellClassType)) { found = true }
        }
        )
      }
      return found;
    }
  }

  //
  // Components
  //

  // LayoutCells - component for the layout panel
  // Builds out the html objects for all of the cells in a cellTree
  // Inputs:
  // cellTree - an object containing all of the cells (nested binary tree)within a cell container
  // returns the html structure for all of the cells within a cell container to be rendered

  // Recursive code is based on the approach in this article:
  // https://www.freecodecamp.org/news/how-to-use-recursion-in-react/
  function LayoutCells({ cellTree }) {
    let cellStyles = null;
    if (cellTree.cellContent) {
      // Fetch image content from image cells array
      const matchingCell = imageCells.find(cell => cell.id === cellTree.cellContent);
      const imgUrl = (matchingCell) ? matchingCell.imgUrl : "";
      // set up image content
      cellStyles = { backgroundImage: `url(${imgUrl})`, backgroundColor: 'orange' }
    }
    return (
      <div key={cellTree.cellId} className={cellTree.classType}
        onClick={cellTree.isClickable ? ((evt) => handleSplitCell(evt, cellTree.cellId)) : null}
        draggable={cellTree.isClickable}
        onDragStart={cellTree.isClickable ? ((evt) => handleDragStart(evt, cellTree.cellId, cellTree.cellContent)) : null}
        onDragOver={cellTree.isClickable ? ((evt) => handleDragOver(evt)) : null}
        onDragEnter={cellTree.isClickable ? ((evt) => handleDragEnter(evt)) : null}
        onDragLeave={cellTree.isClickable ? ((evt) => handleDragLeave(evt)) : null}
        onDrop={cellTree.isClickable ? ((evt) => handleDrop(evt, cellTree.cellId, cellTree.cellContent)) : null}
        tabIndex={cellTree.isClickable ? "0" : null}
        style={cellStyles}
      >
        {/* {cellTree.cellContent ? (<img src={cellTree.cellContent.imgUrl} alt={cellTree.cellContent.imgAlt}/>) : null } */}
        {cellTree?.cellChildren?.map((child) => {
          return (
            <LayoutCells cellTree={child} />
          );
        }
        )}
      </div>
    );
  }


  // App  
  return (
    <>
      <div className="editor">
        <h1>Splitting squares</h1>
        <div className="action-area">
          <button className="btn--add-cell" onClick={handleAddCell}>
            Add layout cell
          </button>
          <button className="btn--save-layout" onClick={handleSaveLayout}>
            Save layout
          </button>

          <div className="select-menu">
            <label htmlFor="layout-select">Load layout:</label>
            <select
              name="load-layouts"
              id="layout-select"
              onChange={loadLayout}
              value={selectedLayoutValue}
            >
              {layoutOptions.map((layoutOption) => (
                <option key={layoutOption.value} value={layoutOption.value}>
                  {layoutOption.value}
                </option>
              ))}
            </select>
          </div>

          <div className="select-menu">
            <label htmlFor="select-option">Split cell into:</label>
            <select id="select-option"
              value={splitCellSelectedValue}
              onChange={handleSplitCellSelectChange}>
              <option value="rows">rows</option>
              <option value="cols">cols</option>
            </select>
          </div>

        </div> {/* end action-area  */}

        <div className="edit-area">
          <div className="image-panel">
            <h2>Image palette</h2>
            <p>Drag n drop images</p>
            <div className="image-cells">
              {imageCells.map((cell) => (
                <div
                  key={cell.id}
                  className="image-cell" // Add your CSS class for image cells here
                  onDragStart={(e) => handleDragStart(e, cell.id, cell.id)}
                  onDragEnd={(e) => handleDragEnd(e)}
                  draggable
                  role="img"
                  aria-label={cell.imgAlt}
                  tabIndex={0}
                  style={{ backgroundImage: `url(${cell.imgUrl})`, backgroundColor: 'orange' }}
                ></div>
                // ><img src={cell.imgUrl} alt={cell.imgAlt}/></div>
              ))}
            </div>

          </div>
          <div className="layout-panel">
            <h2>Cell layout</h2>
            <p> Cell split mode: {splitCellSelectedValue}</p>
            <p>
              Images can be swapped between cells <br></br>
              Cells can be split into columns or rows
            </p>
            <div className="cell-layout-panel">
              {cellLayout.map((cellContainer) => (
                <div key={cellContainer.containerId} className="cell-container">
                  <LayoutCells cellTree={cellContainer.containerChild} />
                </div>
              )
              )}
            </div>

          </div>
        </div>

      </div>

    </>
  )
}

export default App
