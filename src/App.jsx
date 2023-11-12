import { useState } from 'react'
// import SplitCellSelectMenu from './SplitCellSelectMenu'
import './App.scss'

let containerIdCount = 0;
let cellIdCount = 100;

function App() {
  const [imageCells, setImageCells] = useState([
    { id: 'img100', 
      imgUrl: 'https://media.nga.gov/iiif/a8c923e1-078d-4f94-b1f4-0e303afe2155/full/!740,560/0/default.jpg',
      imgAlt: 'painting by Rothko abstract with shades of yellow and orange'
     },
    { id: 'img101', 
      imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9OUHCCZD-mGE1nt0-IKYFb39Cu--s2yvYrq-0oyN8WIpd6dRBNjrL7nzAuQGyDwMIo3g&usqp=CAU',
      imgAlt: '' 
    },
    { id: 'img103', 
      imgUrl: 'https://miro.medium.com/v2/resize:fit:0/1*OPTDa-ekwUOSpE3QvjZTeg.jpeg',
      imgAlt: '' },
    // Add more cells as needed
  ]);

  // State hooks
  const [cellLayout, setCellLayout] = useState([ 
    {
      containerId: containerIdCount,
      containerChild: 
      {
        cellId: cellIdCount,
        classType: "cell",
        isClickable: true,
        cellContent: 'img100',
        // cellContent: {
        //   imgUrl: 'https://miro.medium.com/v2/resize:fit:0/1*OPTDa-ekwUOSpE3QvjZTeg.jpeg',
        //   imgAlt: 'blue painting by Rothko'
        // }
      }
    }

  ]);
  // States to manage Load layout select menu
  // const [layouts, setLayouts] = useState(['']);
  // const [selectedLayout, setSelectedLayout] = ('');
  const [selectedLayoutValue, setSelectedLayoutValue] = useState('New');
  const [layoutOptions, setLayoutOptions] = useState([
    { value: 'New', label: 'New' },
  ]);
  // State to manage the split cell selected value
  const [splitCellSelectedValue, setSplitCellSelectedValue] = useState('rows');


  // Event handlers
  const handleAddCell = () => {
    containerIdCount += 1;
    cellIdCount += 1;

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

  const handleNewLayout = () => {
    setCellLayout([ 
      {
        containerId: containerIdCount,
        containerChild: 
        {
          cellId: ++cellIdCount,
          classType: "cell",
          isClickable: true,
        }
      }
  
    ]);
  };

  const loadLayout = (evt) => {
    // Load layout logic here

    const loadSelection = evt.target.value;
    setSelectedLayoutValue(loadSelection);

    if(loadSelection === "New") {
      // Clear current layout and set up 4 empty cells
    } else {
      //Retrieve saved layout
      const serializedLayout = localStorage.getItem(loadSelection);

      console.log("retrieved serialized layout = ");
      console.log(serializedLayout);
      

      if (serializedLayout) {
        try {
          const stateFromLocalStorage = JSON.parse(serializedLayout);
          // console.log("stateFromLocalStorage ", stateFromLocalStorage);
  
          // Update the existing state with the state from local storage
          // I'm not sure why I have to have the .cellLayout object.
          // Why can't I do the following?
          //setCellLayout(stateFromLocalStorage.cellLayout);
          setCellLayout(stateFromLocalStorage.cellLayout);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
  };

  const handleSaveLayout = () => {
    // Save layout logic here
    const newLayoutName = prompt("Please enter a name for the layout:");

    if (newLayoutName) {
      // add new name to the Load select menu
      const newLoadOption = { value: newLayoutName, label: `(${newLayoutName})` };
      setLayoutOptions([...layoutOptions, newLoadOption]);
      setSelectedLayoutValue(newLayoutName);

    // Save a copy of the current layout

    // const currentCellLayout = {cellLayout}; // do I need to make a deep copy first?
    // const serializedLayout = JSON.stringify(currentCellLayout);
    const serializedLayout = JSON.stringify({cellLayout});
    
    console.log("saving current cell layout to local storage with selected value of " + newLayoutName);
    localStorage.setItem(newLayoutName,serializedLayout);

    }


  };

  function handleDragStart (evt, sourceId, sourceImgId) {
    // If source is an image from the image panel then set it up
    // to be copied, otherwise we'll swap images between the target 
    // and the source
    const expression = /^img/;
    const dragData = {
      sourceId: sourceId,
      sourceImgId: sourceImgId
    }

    evt.dataTransfer.effectAllowed = (expression.test(sourceId)) ? 'copy' : 'move'
    console.log("transfer allowed = " + evt.dataTransfer.effectAllowed);
    evt.dataTransfer.setData('text', JSON.stringify(dragData));
  }

  function handleDragOver (evt) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    // evt.dataTransfer.dropEffect = 'copy';
    // evt.dataTransfer.dropEffect = currentDragType
    console.log("in handleDragOver");
    return false;
  }
  

  function handleDrop (evt, targetId, targetImgId) {
    evt.preventDefault();
    // evt.stopPropogation();

    console.log("in handleDrop");
    let dragData;

    try {
      dragData = JSON.parse(evt.dataTransfer.getData('text'));
    } catch (e) {
      // If the text data isn't parsable we'll just ignore it.
      return;
    }
    console.log("targetId = " + targetId);
    console.log("dragged data = ");
    console.log(dragData);
    console.log("transfer allowed = " + evt.dataTransfer.effectAllowed);
    const sourceId = dragData.sourceId;
    const sourceImgId = dragData.sourceImgId;
    // const sourceId = Number(evt.dataTransfer.getData('text/plain'));
  
    // if transfer allowed is copy replace image for target cell
    // otherwise swap images between source and target cells

    const tempLayout = JSON.parse(JSON.stringify({cellLayout}));
    let sourceCell = null;
    let targetCell = null;
    let srcFound = false;
    let targetFound = false;
    // tempLayout.cellLayout.forEach((cellContainer) => {
    //     if (!srcFound) {
    //       sourceCell = findCell(cellContainer.containerChild, sourceId);
    //       console.log("returned sourceCell = ");
    //       console.log(sourceCell);
    //     }

    //     if (sourceCell) { srcFound = true; }      
    //   }
    // );
    // copy source image to target cell
    tempLayout.cellLayout.forEach((cellContainer) => {
        updateCellContent(cellContainer.containerChild, targetId, sourceImgId);   
      }  
    );

    if(evt.dataTransfer.effectAllowed === 'move') {
      //swap images
      tempLayout.cellLayout.forEach((cellContainer) => {
          updateCellContent(cellContainer.containerChild, sourceId, targetImgId);   
        }  
      );
    }

    setCellLayout(JSON.parse(JSON.stringify(tempLayout.cellLayout)));
  }
  

  // Handler for select change
  const handleSplitCellSelectChange = (event) => {
    setSplitCellSelectedValue(event.target.value);
  };

  const handleSplitCell = (evt, id) => {
    // Split cell logic here
    // console.log('selected split state = ');
    // console.log({splitCellSelectedValue});
    // console.log("id = " + id);
    // console.log("cellLayout = ");
    // console.log({cellLayout});

    const splitState = (splitCellSelectedValue === "cols") ? "cell-cols" : "cell-rows"
    const tempLayout = JSON.parse(JSON.stringify({cellLayout}));

    // console.log("tempLayout = ");
    // console.log(tempLayout);

    let found = false;
    tempLayout.cellLayout.forEach((cellContainer) => {
        if (formatData(cellContainer.containerChild, id, splitState)) {found = true;}
      }
    );
    

    // setCellLayout((currentLayout) => [...currentLayout, JSON.parse(JSON.stringify(tempLayout))]);
    setCellLayout(JSON.parse(JSON.stringify(tempLayout.cellLayout)));
    
    // console.log("tempLayout after formatting = ");
    // console.log(tempLayout);

    // console.log("current cellLayout after formatting = ");
    // console.log({cellLayout});

  };

  function updateCellContent (cellTree, cellId, newContent) {
    // console.log("in updateCellContent: cellId = " + cellId + " and cellTree = ");
    // console.log(cellTree);
    
    if(!cellTree) {
      console.log("end of tree, returning null");
      return false;
    }

    console.log("cellTree.cellId = " + cellTree.cellId);

    if(cellTree.cellId === cellId) {
      console.log("cell found, updating content");
      cellTree.cellContent = newContent;
      return (true);
    } else {
      {cellTree?.cellChildren?.forEach((child) => {
            updateCellContent(child, cellId, newContent);
        }
      )}
    }

  }

  // returns cell if found
  function findCell(cellTree, cellId){
    console.log("in findCell: cellId = " + cellId + " and cellTree = ");
    console.log(cellTree);
    let cellFound = false;

    if(!cellTree) {
      console.log("end of tree, returning null");
      return null;
    }

    console.log("cellTree.cellId = " + cellTree.cellId);

    if(cellTree.cellId === cellId) {
      console.log("cell found, returning cellTree = ");
      console.log(cellTree);
      cellFound = true;
      return (cellTree);
    } else {
      {cellTree?.cellChildren?.forEach((child) => {
          if (!cellFound){
            findCell(child, cellId);
          }
        }
      )}
    }

  }

  // const findImage = (id) => {
  //   console.log("id = " + id);
  //   let newImgUrl = "";
  //   {imageCells.map((cell) => {
  //     console.log("cell.id = " + cell.id);
  //     if(cell.id === id) { 
  //       console.log ("match!");
  //       return (cell.imgUrl);
  //     }
  //   }
  // )}
  // }

  //Support functions
  // Recursive code is based on the approach in this article:
  // https://www.freecodecamp.org/news/how-to-use-recursion-in-react/
  function LayoutCells ({cellTree}) {
    // console.log("cellTree = ");
    // console.log(cellTree);
    let cellStyles = null;
    if(cellTree.cellContent) {
      const matchingCell = imageCells.find(cell => cell.id === cellTree.cellContent);
      // const imgUrl = findImage(cellTree.cellContent);
      const imgUrl = (matchingCell) ? matchingCell.imgUrl : "";
      // console.log("imgUrl = " + imgUrl);
      // cellStyles = { backgroundImage: `url(${cellTree.cellContent.imgUrl})`, backgroundColor:'orange'  }
      cellStyles = { backgroundImage: `url(${imgUrl})`, backgroundColor:'orange'  }
    }
    return (
      <div key={cellTree.cellId} className={cellTree.classType}
        onClick={cellTree.isClickable ? ((evt) => handleSplitCell(evt, cellTree.cellId)) : null}
        draggable={cellTree.isClickable}
        onDragStart={cellTree.isClickable ? ((evt) => handleDragStart(evt, cellTree.cellId, cellTree.cellContent)) : null}
        onDragOver={cellTree.isClickable ? ((evt) => handleDragOver(evt)) : null}
        onDrop={cellTree.isClickable ? ((evt) => handleDrop(evt, cellTree.cellId, cellTree.cellContent)) : null}
        style={cellStyles}
        >
          {/* {cellTree.cellContent ? (<img src={cellTree.cellContent.imgUrl} alt={cellTree.cellContent.imgAlt}/>) : null } */}
        {cellTree?.cellChildren?.map((child) => {
            return(
              <LayoutCells cellTree={child}/>
            );
          }
        )}
      </div>
    );
  }

  // If cell with cellId found:
  // Adds 2 new child cells to current cellId cell,
  // updates current cellto be non-clickable,
  // and transfers image from original cell to the 2 new child cells
  // 
  function formatData(cellTree, cellId, cellClassType){
    // console.log("cellId = " + cellId);

    if(!cellTree) {return false}
    // console.log("cellTree.cellId = " + cellTree.cellId);

    cellIdCount += 1;
    const childId1 = cellIdCount;
    cellIdCount += 1;
    // console.log("now current cellIdCount = " + cellIdCount);
    const childId2 = cellIdCount;
    const currentContent = (cellTree.cellContent) ? cellTree.cellContent : null;
    if(cellTree.cellId === cellId) {
      cellTree.classType = cellClassType;
      cellTree.isClickable = false;
      cellTree.cellChildren = [ {
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
      // console.log("after adding children current cellIdCount = " + cellIdCount);
      cellTree.cellContent = null;
      return true;
    } else {
      let found = false;
      {cellTree?.cellChildren?.map((child) => {
        if(formatData(child, cellId, cellClassType)){found = true}
        }
      )}
      return found;
    }
  }

  // console.log("in app, cellLayout is: ");
  // console.log({cellLayout});
  


  return (
    <>
      <div className="editor">
        <h1>Simple Editor</h1>
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

          <label htmlFor="layout-select">Load layout:</label>
          <select
            name="load-layouts"
            id="layout-select"
            onChange={loadLayout}
            value={selectedLayoutValue}
          >
            {/* <option value="new">new</option> */}
            {layoutOptions.map((layoutOption) => (
              <option key={layoutOption.value} value={layoutOption.value}>
                {layoutOption.value}
              </option>
            ))}
          </select>

          <div>
            <label htmlFor="selectOption">Split cell into:</label>
            <select id="selectOption" 
              value={splitCellSelectedValue} 
              onChange={handleSplitCellSelectChange}>
              <option value="rows">rows</option>
              <option value="cols">cols</option>
            </select>

            {/* <p>Selected Option: {selectedValue}</p> */}
          </div>

        </div> {/* end action-area  */}

        <div className="edit-area">
          <div className="image-panel">
            <h2>Drag and Drop Images</h2>
            <div className="image-cells">
              {imageCells.map((cell) => (
                <div
                  key={cell.id}
                  className="image-cell" // Add your CSS class for image cells here
                  onDragStart={(e) => handleDragStart(e, cell.id, cell.id)}
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
