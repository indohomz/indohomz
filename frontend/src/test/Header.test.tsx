import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Layout/Header'

function noop() {}

describe('Header', () => {
  it('toggles theme', () => {
    const { rerender } = render(
      <Header
        onOpenMobileSidebar={noop}
        onOpenCommandPalette={noop}
      />
    )
    const btn = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(btn)
    // After click, we expect documentElement to contain dark or light class toggled
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    fireEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    rerender(<Header onOpenMobileSidebar={noop} onOpenCommandPalette={noop} />)
  })
})
