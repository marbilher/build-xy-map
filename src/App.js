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

    let saved_i = -1;
    let saved_j = -1;

    sketch.setup = () => {
      sketch.createCanvas(screenSize, screenSize);

      for (let i=0; i<cols; i++) {
        for (let j=0; j<rows; j++) {
          blockMatrix[i][j] = sketch.color(255)
        }
      }

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

      sketch.mousePressed = () => {
        for (let i=0; i<cols; i++) {
          for (let j=0; j<rows; j++) {
            let x = i*blockSize;
            let y = j*blockSize;

            if (sketch.mouseX > x && sketch.mouseX < (x + blockSize) && sketch.mouseY > y && sketch.mouseY < (y + blockSize)) {
                blockMatrix[i][j] = sketch.color(0);
                if (j>0) blockMatrix[i][j-1]= sketch.color(255, 255, 0);
                if (j<rows-1) blockMatrix[i][j+1]= sketch.color(255, 255, 0);
                if (i>0) blockMatrix[i-1][j]= sketch.color(255, 255, 0);
                if (i<cols-1) blockMatrix[i+1][j]= sketch.color(255, 255, 0);
                saved_i = i;
                saved_j = j;
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
      <div ref={this.myRef}>

      </div>
    )
  }
}

export default App;
