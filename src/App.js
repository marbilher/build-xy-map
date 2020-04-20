import React from 'react';
import './App.css';
import p5 from 'p5';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }
  
  Sketch = (sketch) => {
    
    let screenSize = 900;
    let blockSize = screenSize/30;
    let blockMatrix = Array.from(Array(blockSize), () => new Array(blockSize))
    let cols = screenSize/blockSize;
    let rows = screenSize/blockSize;

    let availableBlocks = [];
    let existingBlocks = [];
    let unavailableBlocks = [];



    sketch.setup = () => {
      sketch.createCanvas(screenSize, screenSize);

      for (let i=0; i<cols; i++) {
        for (let j=0; j<rows; j++) {
          blockMatrix[i][j] = sketch.color(255)
        }
      }

      //initial block to randomly build off of
      sketch.writeNewBlock(15, 15)

      };

      sketch.draw = () => {
        
        sketch.background(255);
        for (let i=0; i<cols; i++) {
          for (let j=0; j<rows; j++) {
            sketch.fill(blockMatrix[i][j]);
            sketch.rect(i*blockSize, j*blockSize, blockSize, blockSize);
          }
        }
      };


    sketch.clearGrid = () => {
      for (let i=0; i<cols; i++) {
        for (let j=0; j<rows; j++) {
          blockMatrix[i][j] = sketch.color(255)
        }
      }
      availableBlocks = []
      existingBlocks = []
      unavailableBlocks = []
      sketch.writeNewBlock(15, 15)

    }

    sketch.renderBlocks = () => {
      availableBlocks.forEach(index => {
        blockMatrix[index.x][index.y] = sketch.color(255, 255, 0)
      })
      existingBlocks.forEach(index => {
        blockMatrix[index.x][index.y] = sketch.color(0)
      })
      unavailableBlocks.forEach(index => {
        blockMatrix[index.x][index.y] = sketch.color(0, 0, 255)
      })
    }

    sketch.findBlockByCoords = (blockArray, x, y) => {
      let index = blockArray.findIndex(value => value.x == x && value.y == y)
      if(index !== -1) {   
        return true
      } else {
        return false
      }
    }

    sketch.getBlockNeighbors = (x_coordinate, y_coordinate) => {  //Can allow overloads and callbacks here to increase versatility
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate + 1, y_coordinate) 
          || sketch.findBlockByCoords(availableBlocks, x_coordinate + 1, y_coordinate)
          || sketch.findBlockByCoords(unavailableBlocks, x_coordinate + 1, y_coordinate)) {
        console.log('found neighbor right') 
      } else {
        availableBlocks.push({ x : x_coordinate + 1, y : y_coordinate })
      }
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate - 1, y_coordinate) 
          || sketch.findBlockByCoords(availableBlocks, x_coordinate - 1, y_coordinate)
          || sketch.findBlockByCoords(unavailableBlocks, x_coordinate - 1, y_coordinate)) {
        console.log('found neighbor left') 
      } else {
        availableBlocks.push({ x : x_coordinate - 1, y : y_coordinate })
      }
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate, y_coordinate + 1) 
          || sketch.findBlockByCoords(availableBlocks, x_coordinate, y_coordinate + 1)
          || sketch.findBlockByCoords(unavailableBlocks, x_coordinate, y_coordinate + 1)) {
        console.log('found neighbor below') 
      } else {
        availableBlocks.push({ x : x_coordinate, y : y_coordinate + 1})
      }
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate, y_coordinate - 1) 
          || sketch.findBlockByCoords(availableBlocks, x_coordinate, y_coordinate - 1)
          || sketch.findBlockByCoords(unavailableBlocks, x_coordinate, y_coordinate - 1)) {
        console.log('found neighbor above') 
      } else {
        availableBlocks.push({ x : x_coordinate, y : y_coordinate - 1})
      }
      sketch.deleteFromAvailableByCoords(x_coordinate, y_coordinate)
      sketch.renderBlocks()
    }

    sketch.deleteFromAvailableByCoords = (x_coordinate, y_coordinate) => {
      for(let i = 0; i < availableBlocks.length; i++) {
        if(availableBlocks[i].x == x_coordinate && availableBlocks[i].y == y_coordinate) {
          availableBlocks.splice(i, 1)
        }
      }
    }


    sketch.writeNewBlock = (x_coordinate, y_coordinate) => {
      existingBlocks.push({ x : x_coordinate, y : y_coordinate });
      sketch.getBlockNeighbors(x_coordinate, y_coordinate)

    }

    sketch.writeNewUnavailable = (x_coordinate, y_coordinate) => {
      unavailableBlocks.push({ x : x_coordinate, y : y_coordinate });
      sketch.deleteFromAvailableByCoords(x_coordinate, y_coordinate);
      sketch.renderBlocks()
    }

    sketch.userAddUnavailable = (numUnavail) => {
      while(numUnavail > 0) {
        let randomnUnavailable = Math.floor(Math.random() * Math.floor(availableBlocks.length));
        sketch.writeNewUnavailable(availableBlocks[randomnUnavailable].x, availableBlocks[randomnUnavailable].y)
        numUnavail--
        }
    }

    sketch.userAddBlock = (numBlocks) => {
      while(numBlocks > 0) {
      let randomAvailable = Math.floor(Math.random() * Math.floor(availableBlocks.length));
      sketch.writeNewBlock(availableBlocks[randomAvailable].x, availableBlocks[randomAvailable].y)
      numBlocks--;
      }
    }

      sketch.mousePressed = () => {
        for (let i=0; i<cols; i++) {
          for (let j=0; j<rows; j++) {
            let x = i*blockSize;
            let y = j*blockSize;
            if (sketch.mouseX > x && sketch.mouseX < (x + blockSize) && sketch.mouseY > y && sketch.mouseY < (y + blockSize)) {
              if(availableBlocks.some(item => item.x == i && item.y == j)) {
                sketch.writeNewBlock(i, j)
              }
            }
          }
        }
      }
    };


  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current)
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center d-flex align-items-center min-vh-100">
          <div className="col col-lg-3 btn-group-vertical" role="group" style={{height: "25%"}}>
            <button type="button" className="btn btn-primary" onClick={() => this.myP5.clearGrid()}> Clear </button>
            <button type="button" className="btn btn-secondary" onClick={() => this.myP5.userAddBlock(5)}> Add block </button>
            <button type="button" className="btn btn-warning" onClick={() => this.myP5.userAddUnavailable(5)}> Add unavailable </button>

          </div>
            <div className="col-lg-9" ref={this.myRef}>

          </div>
        </div>
      </div>
    )
  }
}

export default App;
