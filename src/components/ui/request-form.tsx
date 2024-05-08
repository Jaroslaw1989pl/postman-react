// built-in React components
import { useEffect, useState } from 'react';
// custom components
import axios from '../../library/axios';
// custom React components
import RequestFormParamsTableUiComponent from './request-form-params-table';
import RequestFormVariablesTableUiComponent from './request-form-variables-table';
// custom style components
import './request-form.css';


enum HttpRequestMethods {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  PATCH = 'PATCH'
}
enum RequestTables {
  Params,
  Authorization,
  Headers,
  Body
}

type PathVariableType = {
  [key: string]: any,
  value: string,
  description: string
};
type QueryParamType = {
  [key: string]: any,
  value: string,
  description: string,
  active: boolean
};

const RequestFormUiComponent = (): React.JSX.Element => {

  // request data collection
  const [requestMethod, setRequestMethod] = useState<string>('GET');
  const [requestAction, setRequestAction] = useState<string>('');
  const [pathVariables, setPathVariables] = useState<PathVariableType[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParamType[]>([]);
  const [bulkQueryParams, setBulkQueryParams] = useState<string>('');
  // JSX dom manipulation
  const [activeTable, setActiveTable] = useState<number>(RequestTables.Params);

  const handleSetRequestActionByUrl = (action: string): void => setRequestAction(action);
  
  const handleSetPathVariablesByUrl = (action: string): void => {
    try {
      const variables: PathVariableType[] = [];
      const url = new URL(action);
      const elements = url.pathname.split('/');

      elements.forEach((element) => {
        if (element.startsWith(':') && element.length > 1) {
          variables.push({key: element.substring(1), value: '', description: ''});
        }
      });

      setPathVariables(variables);
      // setBulkPathVariables('');
    } catch (error) {
      setPathVariables([]);
    }
  }
  
  const handleSetQueryParamsByUrl = (action: string): void => {
    try {
      const params: QueryParamType[] = [];
      const url = new URL(action);
      const entries = url.searchParams.entries();

      for (const [key, value] of entries) {
        params.push({key: key, value: value, description: '', active: true});
      }

      const queryParamsLength = queryParams.length;
      let offset = 1;
      for (let i = 0; i < queryParamsLength; i++) {
        let isParamExists = params.findIndex((param) => param.key === queryParams[i].key && param.value === queryParams[i].value);
        if (queryParams[i].active === false && isParamExists < 0) {
          // preserves hidden parameters in the table when editing the URL
          params.splice(i + offset, 0, queryParams[i]);
          offset++;
        } else if (queryParams[i].active === false && isParamExists >= 0) {
          // this condition can be feature but also undesirable behavior
          // preserves hidden parameters in the table when pasting a URL containing those query parameters
          // params[isParamExists] = queryParams[i];
        }
      }

      setQueryParams(params);
      setBulkQueryParams(params.map((param) => `${param.key}:${param.value}`).join('\n'));
    } catch (error) {
      setQueryParams([]);
    }
  };

  const handleSetRequestActionByTable = (params: QueryParamType[]): void => {

    const filteredQueryParams = params.filter((p) => p.active === true);
    const requestQueryString = filteredQueryParams.map((p) => `${p.key}=${p.value}`).join('&');
  
    setRequestAction(requestAction.split('?')[0] + (requestQueryString.length ? `?${requestQueryString}` : ''));
  };
  const handleSetQueryParamsByTable = (params: QueryParamType[]): void => setQueryParams([...params]);
  
  const handleSetBulkQueryParamsByTable = (params: string): void => setBulkQueryParams(params);

  const handleSetPathVariablesByTable = (variables: PathVariableType[]): void => setPathVariables([...variables]);
  
  // const handleSetBulkPathVariablesByTable = (variables: string): void => setBulkQueryParams(variables);

  const handleRequest = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    console.log(requestMethod, requestAction);
    console.log(pathVariables);
    console.log(queryParams);

    // axios({
    //   method: requestMethod,
    //   url: requestAction
    // })
    // .then((response) => {
    //   console.log(response.data);
    // })
    // .catch((error) => {
    //   console.warn(error);
    // });
  };

  return (
    <form action={requestAction} method={requestMethod}>
      <div id="request-form-bar">
        <select name="requestMethod" id="request-method-dropdown" onChange={(event) => setRequestMethod(event.target.value)}>
          {
            Object.keys(HttpRequestMethods).map((method, index) => <option key={index} value={method}>{method}</option>)
          }
        </select>
        <input 
          type="text" name="requestUrl" id="request-url-input" 
          onChange={(event) => [
            handleSetRequestActionByUrl(event.target.value), 
            handleSetPathVariablesByUrl(event.target.value),
            handleSetQueryParamsByUrl(event.target.value)
          ]} 
          value={requestAction} 
        />
        <input type="submit" id="request-send-btn" value="Send" onClick={handleRequest} />
      </div>
      <div id="request-form-tables-navigation">
        <ul id="tabs-list">
          <li className="tab-list-item">
            <button 
              type="button" className="tab-btn" onClick={() => setActiveTable(RequestTables.Params)}
            >{RequestTables[RequestTables.Params]}</button>
          </li>
          <li className="tab-list-item">
            <button 
              type="button" className="tab-btn" onClick={() => setActiveTable(RequestTables.Authorization)}
            >{RequestTables[RequestTables.Authorization]}</button>
          </li>
          <li className="tab-list-item">
            <button 
              type="button" className="tab-btn" onClick={() => setActiveTable(RequestTables.Headers)}
            >{RequestTables[RequestTables.Headers]}</button>
          </li>
          <li className="tab-list-item">
            <button 
              type="button" className="tab-btn" onClick={() => setActiveTable(RequestTables.Body)}
            >{RequestTables[RequestTables.Body]}</button>
          </li>
        </ul>
      </div>

      <div id="request-form-tables">
        {
          activeTable === RequestTables.Params
          ? <div className="request-form-table">
              <div id="query-params-table-container">
                <p>Query params</p>
                <RequestFormParamsTableUiComponent 
                  queryParams={queryParams} 
                  bulkQueryParams={bulkQueryParams}
                  handleRequestAction={handleSetRequestActionByTable}
                  handleQueryParams={handleSetQueryParamsByTable}
                  handleBulkQueryParams={handleSetBulkQueryParamsByTable}
                />
              </div>
                {
                  pathVariables.length
                  ? <div id="path-variables-table-container">
                      <p>Path variables</p>
                      <RequestFormVariablesTableUiComponent 
                        pathVariables={pathVariables}
                        handlePathVariables={handleSetPathVariablesByTable}
                      />
                    </div>
                  : <></>
                }
            </div>
          : activeTable === RequestTables.Authorization
          ? <div className="request-form-table">Authorization</div>
          : activeTable === RequestTables.Headers
          ? <div className="request-form-table">Headers</div>
          : activeTable === RequestTables.Body
          ? <div className="request-form-table">Body</div>
          : <></>
        }
      </div>

    </form>
  );
};

export default RequestFormUiComponent;