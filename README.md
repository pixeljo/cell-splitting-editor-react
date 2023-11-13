# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
--------------------------------

# Splitting Squares
An interactive editor that allows users to drag and drop (as a copy) images from an image palette to a cell in the cell layout area. <br>

In the layout cell, the following actions can be performed:
- split a cell into columns
- split a cell into rows
- swap images between cells, using drag and drop

The following editor actions are available:
- Add a new cell
- Save current layout  (to local storage only)
- Load a saved layout
- Load a new layout

Bugs/Features
- Save functionality not very robust:
    - Same name can be used, and it will show up in the layout menu twice.
- Load functionality: 
    - doesn't ask user to save current layout before loading a new layout.
    - can't load a new layout if current initial layout hasn't been saved.
- Can't undo any action
- Need better signals - cursors, visual cues, when dragging and dropping
- Accessibility issues:
    - Can't do drag/drop using keyboard keys
    - Doesn't have aria attributes for drag and drop
    - Not tested with a screen reader
    - not tested for keyboard navigation
    - User cannot navigate via keyboard to Image cells and layout cells - tabgroup/indexes need to be set up
    - Role for image cell is currently image, but it is also draggable.