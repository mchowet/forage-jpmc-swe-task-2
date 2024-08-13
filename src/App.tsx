import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
  fetchingData: boolean
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
      fetchingData: false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph)
    {
        return (<Graph data={this.state.data}/>);
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    const MAX_TICKS_PER_CLICK = 1000;
    let tickCount = MAX_TICKS_PER_CLICK;

    if (this.state.fetchingData)
        return; // If we are already getting data, don't fire it again

    this.setState({fetchingData: true});
    const intervalID = setInterval(() => {
        if (tickCount-- <= 0)
        {
            clearInterval(intervalID);
            this.setState({fetchingData: false});
        }
        else
        {
            DataStreamer.getData((serverResponds: ServerRespond[]) => {
                this.setState({data: serverResponds, showGraph: true});
            });
        }
    }, 100);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
