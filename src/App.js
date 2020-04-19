import React from 'react';
import './App.css';
import p5 from 'p5';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
    // this.writeNewBlock = this.writeNewBlock.bind(this)


    // this.availableBlocks = [];
    // this.existingBlocks = [];
    // this.unavailableBlocks = [];
  }
  //draw availableBlocks yellow

  //getAvailableBlocks
  //find all neighbors of existing blocks
  //subtract unavailableBlocks
  //subtract outOfBoundsBlocks (not required in database algo since will be infinite)
  //


  
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
      sketch.writeNewBlock(15, 15)

    }

    sketch.renderBlocks = () => {
      availableBlocks.forEach(index => {
        blockMatrix[index.x][index.y] = sketch.color(255, 255, 0)
      })
      existingBlocks.forEach(index => {
        blockMatrix[index.x][index.y] = sketch.color(0)
      })
      console.log('Available after render')
      console.log(availableBlocks)

    }

    sketch.findBlockByCoords = (blockArray, x, y) => {
      let index = blockArray.findIndex(value => value.x == x && value.y == y)
      if(index !== -1) {   
        return true
      } else {
        return false
      }
    }

    sketch.getBlockNeighbors = (x_coordinate, y_coordinate) => {
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate + 1, y_coordinate) || sketch.findBlockByCoords(availableBlocks, x_coordinate + 1, y_coordinate)) {
        console.log('found neighbor right') 
      } else {
        availableBlocks.push({ x : x_coordinate + 1, y : y_coordinate })
      }
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate - 1, y_coordinate) || sketch.findBlockByCoords(availableBlocks, x_coordinate - 1, y_coordinate)) {
        console.log('found neighbor left') 
      } else {
        availableBlocks.push({ x : x_coordinate - 1, y : y_coordinate })
      }
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate, y_coordinate + 1) || sketch.findBlockByCoords(availableBlocks, x_coordinate, y_coordinate + 1)) {
        console.log('found neighbor below') 
      } else {
        availableBlocks.push({ x : x_coordinate, y : y_coordinate + 1})
      }
      if(sketch.findBlockByCoords(existingBlocks, x_coordinate, y_coordinate - 1) || sketch.findBlockByCoords(availableBlocks, x_coordinate, y_coordinate - 1)) {
        console.log('found neighbor above') 
      } else {
        availableBlocks.push({ x : x_coordinate, y : y_coordinate - 1})
      }
      sketch.deleteFromAvailableByCoords(x_coordinate, y_coordinate)
      sketch.renderBlocks()
    }

    sketch.deleteFromAvailableByCoords = (x, y) => {
      availableBlocks.filter(value => {
        if(value.x != x && value.y != y) {
          return value
        }
      })
    }

    sketch.writeNewBlock = (x_coordinate, y_coordinate) => {
      existingBlocks.push({ x : x_coordinate, y : y_coordinate });
      console.log('Listing existing blocks')
      existingBlocks.forEach(index => console.log("existing block: " + index.x + ' ' + index.y))
      sketch.getBlockNeighbors(x_coordinate, y_coordinate)

    }

    sketch.userAddBlock = () => {
      let randomAvailable = Math.floor(Math.random() * Math.floor(availableBlocks.length));
      console.log(randomAvailable)
      console.log(availableBlocks)
      sketch.writeNewBlock(availableBlocks[randomAvailable.x], availableBlocks[randomAvailable.y])

    }

      sketch.mousePressed = () => {
        for (let i=0; i<cols; i++) {
          for (let j=0; j<rows; j++) {
            let x = i*blockSize;
            let y = j*blockSize;
            if (sketch.mouseX > x && sketch.mouseX < (x + blockSize) && sketch.mouseY > y && sketch.mouseY < (y + blockSize)) {
              console.log('i=' + j + ' j= ' + i)
              availableBlocks.forEach(index => console.log("available block: " + index.x + ' ' + index.y))

              if(availableBlocks.some(item => item.x == i && item.y == j)) {
                sketch.writeNewBlock(i, j)
                // if (j>0) blockMatrix[i][j-1]= sketch.color(255, 255, 0); //these lines create game like behavior
                // if (j<rows-1) blockMatrix[i][j+1]= sketch.color(255, 255, 0);
                // if (i>0) blockMatrix[i-1][j]= sketch.color(255, 255, 0);
                // if (i<cols-1) blockMatrix[i+1][j]= sketch.color(255, 255, 0);
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
            <button type="button" className="btn btn-secondary" onClick={() => this.myP5.userAddBlock()}> Add block </button>
          </div>
            <div className="col-lg-9" ref={this.myRef}>

          </div>
        </div>
      </div>
    )
  }
}

export default App;
