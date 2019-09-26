Example:
```
import { Provider } from 'react-redux';
import store from '@steedos/react-components/lib/stores/configureStore'
import SelectUsers from '@steedos/react-components/lib/components/select_users'

function App() {
  let appStore = store({
    settings: {
        services: {
            odata: 'http://127.0.0.1:5000'
        }
    }
  })
  let getRowId = (row) => row._id
  let rootNodes = ["51ae9b1a8e296a29c9000002"]
  return (
    <div className="App">
      <Provider store={appStore} >
        <SelectUsers getRowId={getRowId} rootNodes={rootNodes} valueField="user" />
      </Provider>
    </div>
  );
}

export default App;
```