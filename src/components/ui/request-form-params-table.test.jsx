import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
// custom React components
import RequestFormParamsTableUiComponent from './request-form-params-table';


test('Rendering empty query params table', () => {
  render(<RequestFormParamsTableUiComponent queryParams={[]} />);

  const tableRows = screen.getAllByRole('row');

  expect(tableRows.length).toBe(2);

  tableRows.forEach((row, index) => {
    expect(row).toBeInTheDocument();
    if (index === 0) {
      expect(row.textContent).toEqual('KeyValueDescriptionBulk Edit');
    } else if (index === 1) {
      expect(row.textContent).toEqual('');
    }
  });
});

test('Rendering query params table with values', () => {
  const mockQueryParams = [
    {key: 'q', value: 'test', description: '', active: true},
    {key: 'p', value: '1', description: '', active: false}
  ];

  render(<RequestFormParamsTableUiComponent queryParams={mockQueryParams} />);

  const tableRows = screen.getAllByRole('row');

  expect(tableRows.length).toBe(mockQueryParams.length + 2);

  tableRows.forEach((row, index) => {
    expect(row).toBeInTheDocument();
    if (index === 0) {
      expect(row.textContent).toEqual('KeyValueDescriptionBulk Edit');
    } else if (index === tableRows.length - 1) {
      expect(row.textContent).toEqual('');
    }
  });
});