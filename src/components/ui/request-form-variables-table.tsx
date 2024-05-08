// built-in React components
import { useEffect, useState } from 'react';
// custom style components
import './request-form-table.css';


type PathVariableType = {
  [key: string]: any,
  value: string,
  description: string
};
type tablePropsType = {
  pathVariables: PathVariableType[],
  // bulkQueryParams: string,
  handlePathVariables: (variables: PathVariableType[]) => void
  // handleQueryParams: (params: QueryParamType[]) => void
  // handleBulkQueryParams: (params: string) => void
}

const RequestFormVariablesTableUiComponent = ({ 
  pathVariables/*, bulkQueryParams, handleRequestAction*/, handlePathVariables/*, handleBulkQueryParams*/
}: tablePropsType): React.JSX.Element => {

  // columns visability statuses
  const [isValueColumn, setIsValueColumn] = useState<boolean>(true);
  const [isDescriptionColumn, setIsDescriptionColumn] = useState<boolean>(true);

  const [isTableActive, setTableAsActive] = useState<boolean>(true);
  const [isOptionsWindowOpen, setOptionsWindowVisability] = useState<boolean>(false);

  /**
   * handle switch between query params table and textarea bulk editor
   * @returns void
   */
  const handleSwitchToBulkEdit = (): void => setTableAsActive(!isTableActive);

  /**
   * edit path variables using table inputs
   * new values are send to parent RequestFormUiComponent
   * @param index number
   * @param key string
   * @param value string
   * @returns void
   */
  const handleEditPathVariables = (index: number, key: string, value: string): void => {
    console.log(index, key, value);
    let newPathVariables = [...pathVariables];

    newPathVariables[index][key] = value;

    handlePathVariables(newPathVariables);
    // handleBulkQueryParams(newPathVariables.map((v) => v.active ? `${v.key}:${v.value}` : `#${v.key}:${v.value}`).join('\n'));
  };

  /**
   * edit path variables using textarea editor
   * new values are send to parent RequestFormUiComponent
   * @param params string
   * @returns void
   */
  // const handleEditPathVariablesByBulk = (variablesString: string): void => {

  //   let variables: PathVariableType[] = [];

  //   variablesString.split('\n').forEach((variable, index) => {
  //     const keyValuePair = variable.split(':');
  //     const key = keyValuePair[0] || '';
  //     const value = keyValuePair[1] || '';

  //     variables.push({
  //       key: key.replace('#', '').trim(), 
  //       value: value?.trim(), 
  //       description: pathVariables[index]?.description || ''
  //     });
  //   });

  //   handlePathVariables(variables);
  //   // handleBulkQueryParams(variablesString);
  // };

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
                  type="checkbox" name="" id="variable-value-column" checked={isValueColumn}
                  onChange={() => setIsValueColumn(!isValueColumn)} 
                />
                <label htmlFor="variable-value-column">Value</label>
                <input 
                  type="checkbox" name="" id="variable-description-column" checked={isDescriptionColumn}
                  onChange={() => setIsDescriptionColumn(!isDescriptionColumn)} 
                />
                <label htmlFor="variable-description-column">Description</label>
              </dialog>
              <button type="button" className="bulk-edit query-params" onClick={handleSwitchToBulkEdit}>Bulk Edit</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            pathVariables.map((variable, index) => {
              return (
                <tr key={index}>
                  <td></td>
                  <td colSpan={isValueColumn || isDescriptionColumn ? 1 : 2}>
                    <input 
                      type="text" name="key" id={'key-' + index} placeholder="Key" readOnly value={variable.key} 
                      // onChange={(event) => handleEditPathVariables(index, event.target.name, event.target.value)} 
                    />
                  </td>
                  {
                    isValueColumn
                    ? <td colSpan={isDescriptionColumn ? 1 : 2}>
                        <input 
                          type="text" name="value" id={'value-' + index} placeholder="Value" value={variable.value} 
                          onChange={(event) => handleEditPathVariables(index, event.target.name, event.target.value)} 
                        />
                      </td>
                    : <></>
                  }
                  {
                    isDescriptionColumn
                    ? <td colSpan={2}>
                        <input 
                          type="text" name="description" id={'description-' + index} placeholder="Description" value={variable.description}  
                          onChange={(event) => handleEditPathVariables(index, event.target.name, event.target.value)} 
                        />
                      </td>
                    : <></>
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>

    : <div className="key-value-bulk-editor">
        <div className="bulk-editor-header">
          <button type="button" className="bulk-edit query-params" onClick={handleSwitchToBulkEdit}>Key - Value Edit</button>
        </div>
        <textarea 
          className="bulk-editor-textarea" 
          name="" 
          rows={pathVariables.length + 1} 
          cols={50} 
          // value={bulkQueryParams}
          // onChange={(event) => handleEditQueryParamsByBulk(event.target.value)}
        ></textarea>
      </div>
  );
};

export default RequestFormVariablesTableUiComponent;