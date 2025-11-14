import { render, screen, fireEvent, within } from '@testing-library/react'
import DataTable from '../components/Table/DataTable'

type Row = { name: string; value: number }

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'value', header: 'Value', sortable: true },
] as const

const rows: Row[] = [
  { name: 'Bravo', value: 2 },
  { name: 'Alpha', value: 3 },
]

describe('DataTable', () => {
  it('sorts by column when header clicked', () => {
    render(
      <DataTable<Row>
        columns={columns as any}
        data={rows}
        loading={false}
      />
    )

    const headers = screen.getAllByRole('columnheader')
    const nameHeader = headers[0]

    // Click to sort ascending by Name
    fireEvent.click(within(nameHeader).getByRole('button'))

    // First row should now be Alpha
    const firstCell = screen.getAllByRole('row')[1].querySelector('td')!
    expect(firstCell?.textContent).toMatch('Alpha')

    // Click again to sort descending
    fireEvent.click(within(nameHeader).getByRole('button'))
    const firstCellDesc = screen.getAllByRole('row')[1].querySelector('td')!
    expect(firstCellDesc?.textContent).toMatch('Bravo')
  })
})
