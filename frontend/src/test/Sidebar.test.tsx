import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from '../components/Layout/Sidebar'

const noop = () => {}

describe('Sidebar', () => {
  it('marks current route with aria-current in collapsed mode', () => {
    render(
      <MemoryRouter initialEntries={["/products"]}>
        <Sidebar isCollapsed={true} onToggle={noop} />
      </MemoryRouter>
    )
    const link = screen.getByTitle('Products')
    expect(link).toHaveAttribute('aria-current', 'page')
  })
})
