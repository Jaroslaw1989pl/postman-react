// built-in React components
import { useEffect, useState } from 'react';
// custom style components
import './request-form-table.css';


type QueryParamType = {
  [key: string]: any,
  value: string,
  description: string,
  active: boolean
};
type tablePropsType = {
  queryParams: QueryParamType[],
  bulkQueryParams: string,
  handleRequestAction: (params: QueryParamType[]) => void
  handleQueryParams: (params: QueryParamType[]) => void
  handleBulkQueryParams: (params: string) => void
}

const RequestFormParamsTableUiComponent = ({ 
  queryParams, bulkQueryParams, handleRequestAction, handleQueryParams, handleBulkQueryParams
}: tablePropsType): React.JSX.Element => {

  // columns visability statuses
  const [isValueColumn, setIsValueColumn] = useState<boolean>(true);
  const [isDescriptionColumn, setIsDescriptionColumn] = useState<boolean>(true);

  const [activeInput, setActiveInput] = useState<string>('');
  const [isTableActive, setTableAsActive] = useState<boolean>(true);
  const [isOptionsWindowOpen, setOptionsWindowVisability] = useState<boolean>(false);

  /**
   * handle switch between query params table and textarea bulk editor
   * @returns void
   */
  const handleSwitchToBulkEdit = (): void => setTableAsActive(!isTableActive);

  /**
   * disable/enable query param in table and remove/restore in request url
   * new values are send to parent RequestFormUiComponent
   * @param index number
   * @param active boolean
   * @returns void
   */
  const handleVisabilityQueryParams = (index: number, active: boolean): void => {

    queryParams[index].active = active;

    handleRequestAction(queryParams);
    handleBulkQueryParams(queryParams.map((p) => p.active ? `${p.key}:${p.value}` : `#${p.key}:${p.value}`).join('\n'));
  };

  /**
   * set the position of the query parameter by moving it up or down in the table
   * new values are send to parent RequestFormUiComponent
   * @param index number
   * @param target number
   * @returns void
   */
  const handlePositionQueryParams = (index: number, target: number): void => {
    if (target >= 0 && target < queryParams.length) {

      let newQueryParams = [...queryParams];

      newQueryParams[target] = queryParams[index];
      newQueryParams[index] = queryParams[target];

      handleRequestAction(newQueryParams);
      handleQueryParams(newQueryParams);
      handleBulkQueryParams(newQueryParams.map((p) => p.active ? `${p.key}:${p.value}` : `#${p.key}:${p.value}`).join('\n'));
    }
  };

  /**
   * edit query params using table inputs
   * new values are send to parent RequestFormUiComponent
   * @param index number
   * @param key string
   * @param value string
   * @returns void
   */
  const handleEditQueryParams = (index: number, key: string, value: string): void => {

    let newQueryParams = [...queryParams];

    newQueryParams[index][key] = value;

    handleRequestAction(newQueryParams);
    handleQueryParams(newQueryParams);
    handleBulkQueryParams(newQueryParams.map((p) => p.active ? `${p.key}:${p.value}` : `#${p.key}:${p.value}`).join('\n'));
  };

  /**
   * edit query params using textarea editor
   * new values are send to parent RequestFormUiComponent
   * @param params string
   * @returns void
   */
  const handleEditQueryParamsByBulk = (paramsString: string): void => {

    let params: QueryParamType[] = [];

    paramsString.split('\n').forEach((param, index) => {
      const keyValuePair = param.split(':');
      const paramKey = keyValuePair[0] || '';
      const paramValue = keyValuePair[1] || '';

      params.push({
        key: paramKey.replace('#', '').trim(), 
        value: paramValue?.trim(), 
        description: queryParams[index]?.description || '', 
        active: param?.trim()?.startsWith('#') ? false : true
      });
    });

    handleRequestAction(params);
    handleQueryParams(params);
    handleBulkQueryParams(paramsString);
  };
  
  /**
   * remove query params from url and table by remove button
   * new values are send to parent RequestFormUiComponent
   * @param index number
   * @returns void
   */
  const handleRemoveQueryParams = (index: number): void => {

    queryParams.splice(index, 1);

    handleRequestAction(queryParams);
    handleQueryParams(queryParams);
    handleBulkQueryParams(queryParams.map((p) => p.active ? `${p.key}:${p.value}` : `#${p.key}:${p.value}`).join('\n'));
  };

  /**
   * remove query params from url and table on blur event when param key and value are empty
   * new values are send to parent RequestFormUiComponent
   * @param index number
   * @returns void
   */
  const handleRemoveEmptyQueryParams = (index: number): void => {
    if (queryParams[index].key === '' && queryParams[index].value === '') {
      
      queryParams.splice(index, 1);

      handleRequestAction(queryParams);
      handleQueryParams(queryParams);
      handleBulkQueryParams(queryParams.map((p) => p.active ? `${p.key}:${p.value}` : `#${p.key}:${p.value}`).join('\n'));
    }
  };

  /**
   * add query params to url and table by table inputs
   * new values are send to parent RequestFormUiComponent
   * @param element HTMLElement
   * @returns void
   */
  const handleAddQueryParams = (element: any): void => {

    let newQueryParam: QueryParamType = {key: '', value: '', description: '', active: true};

    newQueryParam[element.name] = element.value;

    let newQueryParams = [...queryParams, newQueryParam];
    
    handleRequestAction(newQueryParams);
    handleQueryParams(newQueryParams);
    handleBulkQueryParams(newQueryParams.map((p) => p.active ? `${p.key}:${p.value}` : `#${p.key}:${p.value}`).join('\n'));
  };

  useEffect(() => {
    document.getElementById(activeInput)?.focus();
    setActiveInput('');
  }, [queryParams]);

  return (
    isTableActive
    
    ? <table className="request-form-table">
        <thead>
          <tr>
            <th></th>
            <th>Key</th>
            {isValueColumn && <th>Value</th>}
            {isDescriptionColumn && <th>Description</th>}
            <th>
              <button 
                type="button" className="table-options query-params" 
                onClick={() => setOptionsWindowVisability(!isOptionsWindowOpen)}
              >...</button>
              <dialog open={isOptionsWindowOpen}>
                <p>Show columns</p>
                <input 
                  type="checkbox" name="" id="param-value-column" checked={isValueColumn}
                  onChange={() => setIsValueColumn(!isValueColumn)} 
                />
                <label htmlFor="param-value-column">Value</label>
                <input 
                  type="checkbox" name="" id="param-description-column" checked={isDescriptionColumn}
                  onChange={() => setIsDescriptionColumn(!isDescriptionColumn)} 
                />
                <label htmlFor="param-description-column">Description</label>
              </dialog>
              <button type="button" className="bulk-edit query-params" onClick={handleSwitchToBulkEdit}>Bulk Edit</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            queryParams.map((param, index) => {
              return (
                <tr key={index} className={!param.active ? 'disabled' : ''}>
                  <td>
                    <input 
                      type="checkbox" name="" id="" checked={!param.active}
                      onChange={(event) => handleVisabilityQueryParams(index, !event.target.checked)} 
                    />
                    <button 
                      type="button" className="row-arrow up" onClick={() => handlePositionQueryParams(index, index - 1)}
                    >&#128314;</button>
                    <button 
                      type="button" className="row-arrow down" onClick={() => handlePositionQueryParams(index, index + 1)}
                    >&#128315;</button>
                    <button type="button" className="param-remove-btn" onClick={() => handleRemoveQueryParams(index)}>&#10060;</button>
                  </td>
                  <td colSpan={isValueColumn || isDescriptionColumn ? 1 : 2}>
                    <input 
                      type="text" name="key" id={'key-' + index} placeholder="Key" value={param.key} 
                      onChange={(event) => handleEditQueryParams(index, event.target.name, event.target.value)} 
                      onFocus={(event) => setActiveInput(event.target.id)}
                      onBlur={() => handleRemoveEmptyQueryParams(index)}
                    />
                  </td>
                  {
                    isValueColumn
                    ? <td colSpan={isDescriptionColumn ? 1 : 2}>
                        <input 
                          type="text" name="value" id={'value-' + index} placeholder="Value" value={param.value} 
                          onChange={(event) => handleEditQueryParams(index, event.target.name, event.target.value)} 
                          onFocus={(event) => setActiveInput(event.target.id)}
                          onBlur={() => handleRemoveEmptyQueryParams(index)}
                        />
                      </td>
                    : <></>
                  }
                  {
                    isDescriptionColumn
                    ? <td colSpan={2}>
                        <input 
                          type="text" name="description" id={'description-' + index} placeholder="Description" value={param.description}  
                          onChange={(event) => handleEditQueryParams(index, event.target.name, event.target.value)} 
                          onFocus={(event) => setActiveInput(event.target.id)}
                        />
                      </td>
                    : <></>
                  }
                </tr>
              );
            })
          }
          <tr>
            <td></td>
            <td colSpan={isValueColumn || isDescriptionColumn ? 1 : 2}>
              <input 
                type="text" name="key" id={'key-' + queryParams.length}  placeholder="Key" value=""
                onChange={(event) => handleAddQueryParams(event.target)} 
                onFocus={(event) => setActiveInput(event.target.id)}
              />
            </td>
            {
              isValueColumn
              ?  
            <td colSpan={isDescriptionColumn ? 1 : 2}>
              <input 
                type="text" name="value" id={'value-' + queryParams.length}  placeholder="Value" value=""
                onChange={(event) => handleAddQueryParams(event.target)} 
                onFocus={(event) => setActiveInput(event.target.id)}
              />
            </td>
              : <></>
            }
            {
              isDescriptionColumn
              ? 
            <td colSpan={2}>
              <input 
                type="text" name="description" id={'description-' + queryParams.length} placeholder="Description" value=""  
                onChange={(event) => handleAddQueryParams(event.target)} 
                onFocus={(event) => setActiveInput(event.target.id)}
              />
            </td>
              : <></>
            }
          </tr>
        </tbody>
      </table>

    : <div className="key-value-bulk-editor">
        <div className="bulk-editor-header">
          <button type="button" className="bulk-edit query-params" onClick={handleSwitchToBulkEdit}>Key - Value Edit</button>
        </div>
        <textarea 
          className="bulk-editor-textarea" 
          name="" 
          rows={queryParams.length + 1} 
          cols={50} 
          value={bulkQueryParams}
          onChange={(event) => handleEditQueryParamsByBulk(event.target.value)}
        ></textarea>
      </div>
  );
};

export default RequestFormParamsTableUiComponent;