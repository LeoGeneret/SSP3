import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {/* eslint-disable-line*/
  const { getByText } = render(<App />)
  const linkElement = getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument() /* eslint-disable-line*/
})
