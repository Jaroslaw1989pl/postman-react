// built-in React components
import { useEffect, useState } from 'react';
// custom components
import axios from '../library/axios';
// custom React components
import RequestFormUiComponent from '../components/ui/request-form';
// custom style components
import './workspace.css';


const WorkspaceView = (): React.JSX.Element => {

  return (
    <div id="page-content">
      <main id="page-main-element">

        <div id="request-form-container">
          <RequestFormUiComponent />
        </div>

      </main>
    </div>
  );
};

export default WorkspaceView;