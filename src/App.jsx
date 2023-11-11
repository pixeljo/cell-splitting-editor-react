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
  const [layouts, setLayouts] = useState(['']);
  const [selectedLayout, setSelectedLayout] = ('');
  // State to manage the split cell selected value
  const [splitCellSelectedValue, setSplitCellSelectedValue] = useState('rows');


  // Event handlers
  const handleAddCell = () => {
    containerIdCount += 1;
    cellIdCount += 1;

    // // let tempCellLayout = [];
    // const tempCellLayout = structuredClone({cellLayout});
    // // console.log("type of cellLayout is: ");
    // // console.log(typeof(cellLayout));
    // // console.log("type of tempCellLayout is: ");
    // // console.log(typeof(tempCellLayout));
    // // console.log("cellLayout = ");
    // // console.log({cellLayout});
    // // setCellLayout([]);
    
    // tempCellLayout.push(
    //   {
    //     containerId: containerId,
    //     containerChild: 
    //     {
    //       cellId: cellId,
    //       classType: "cell",
    //       isClickable: true,
    //     }
    //   }
    // );
    // setCellLayout(structuredClone(tempCellLayout));
    
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

  function handleDragStart (evt, sourceId) {
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('text/plain', sourceId.toString());
  }
  

  function handleDrop (evt, targetId) {
    evt.preventDefault();
    evt.stopPropogation();
  
    const sourceId = Number(evt.dataTransfer.getData('text/plain'));
  
    // const sourceContent = dataFindContent(sourceId);
    // const targetContent = dataFindContent(targetId);
  
  }
  

  // Handler for select change
  const handleSplitCellSelectChange = (event) => {
    setSplitCellSelectedValue(event.target.value);
  };

  const handleSplitCell = (evt, id) => {
    // Split cell logic here
    console.log('selected split state = ');
    console.log({splitCellSelectedValue});
    console.log("id = " + id);
    console.log("cellLayout = ");
    console.log({cellLayout});

    const splitState = (splitCellSelectedValue === "cols") ? "cell-cols" : "cell-rows"
    const tempLayout = JSON.parse(JSON.stringify({cellLayout}));

    console.log("tempLayout = ");
    console.log(tempLayout);

    tempLayout.cellLayout.map((cellContainer) => (
        formatData(cellContainer.containerChild, id, splitState)
      )
    );
    

    // setCellLayout((currentLayout) => [...currentLayout, JSON.parse(JSON.stringify(tempLayout))]);
    setCellLayout(JSON.parse(JSON.stringify(tempLayout.cellLayout)));
    
    // console.log("tempLayout after formatting = ");
    // console.log(tempLayout);

    // console.log("current cellLayout after formatting = ");
    // console.log({cellLayout});

  };

  const findImage = (id) => {
    console.log("id = " + id);
    let newImgUrl = "";
    {imageCells.map((cell) => {
      console.log("cell.id = " + cell.id);
      if(cell.id === id) { 
        console.log ("match!");
        return (cell.imgUrl);
      }
    }
  )}
  }

  //Support functions
  // Recursive code is based on the approach in this article:
  // https://www.freecodecamp.org/news/how-to-use-recursion-in-react/
  function LayoutCells ({cellTree}) {
    console.log("cellTree = ");
    console.log(cellTree);
    let cellStyles = null;
    if(cellTree.cellContent) {
      const matchingCell = imageCells.find(cell => cell.id === cellTree.cellContent);
      // const imgUrl = findImage(cellTree.cellContent);
      const imgUrl = (matchingCell) ? matchingCell.imgUrl : "";
      console.log("imgUrl = " + imgUrl);
      // cellStyles = { backgroundImage: `url(${cellTree.cellContent.imgUrl})`, backgroundColor:'orange'  }
      cellStyles = { backgroundImage: `url(${imgUrl})`, backgroundColor:'orange'  }
    }
    return (
      <div key={cellTree.cellId} className={cellTree.classType}
        onClick={cellTree.isClickable ? ((evt) => handleSplitCell(evt, cellTree.cellId)) : null}
        draggable={cellTree.isClickable}
        onDragStart={cellTree.isClickable ? ((evt) => handleDragStart(evt, cellTree.cellId)) : null}
        onDrop={cellTree.isClickable ? ((evt) => handleDrop(evt, cellTree.cellId)) : null}
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
    // console.log("cellTree = ");
    // console.log(cellTree);
    console.log("cellId = ");
    console.log(cellId);
    if(!cellTree) {return false}
    console.log("cellTree.cellId = ");
    console.log(cellTree.cellId);
    // console.log("cellTree = ");
    // console.log(cellTree);
    console.log("before adding children current cellIdCount = " + cellIdCount);
    cellIdCount += 1;
    console.log("now current cellIdCount = " + cellIdCount);
    const childId1 = cellIdCount;
    cellIdCount += 1;
    console.log("now current cellIdCount = " + cellIdCount);
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
      console.log("after adding children current cellIdCount = " + cellIdCount);
      cellTree.cellContent = null;
      return true;
    } else {
      let found = false;
      {cellTree?.cellChildren?.map((child) => {
        if(formatData(child, cellId, cellClassType)){found = true}
        }
      )}
      return found;
      // formatData(cellTree.cellChildren, cellId, cellClassType);
    }
  }

  console.log("in app, cellLayout is: ");
  console.log({cellLayout});
  


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
            value={selectedLayout}
          >
            <option value="new">new</option>
            {layouts.map((layout) => (
              <option key={layout} value={layout}>
                {layout}
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

// Recursive code is based on the approach in this article:
// https://www.freecodecamp.org/news/how-to-use-recursion-in-react/
// function LayoutCells ({cellTree}) {
  
//   return (
//     <div key={cellTree.cellId} className={cellTree.classType}
//       onClick={cellTree.isClickable ? ((evt) => handleSplitCell(evt, cellTree.cellId)) : null}
//       draggable={cellTree.isClickable}
//       onDragStart={cellTree.isClickable ? ((evt) => handleDragStart(evt, cellTree.cellId)) : null}
//       onDrop={cellTree.isClickable ? ((evt) => handleDrop(evt, cellTree.cellId)) : null}
//       >{cellTree.cellContent ? (<img src={cellTree.cellContent.imgURL} alt={cellTree.cellContent.imgAlt}/>) : null }
//       {cellTree?.cellChildren?.map((child) => {
//         return(
//           <Cell cellTree={child}/>
//          );
//         }
//       )}
//     </div>
//   );
// }




export default App
