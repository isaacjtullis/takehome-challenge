import { render, screen } from '@testing-library/react';
import { OrderHistory } from './OrderHistory';
import '@testing-library/jest-dom';

const mockOrders = [
  { id: '1', term: '1 Year', rate: 1.25, amount: 1000, createdAt: new Date().toISOString() },
  { id: '2', term: '5 Years', rate: 2.5, amount: 5000, createdAt: new Date().toISOString() },
];

describe('OrderHistory', () => {
  it('renders the order history table when orders are provided', () => {
    render(<OrderHistory orders={mockOrders} />);
    
    // Check that the main component container is rendered
    expect(screen.getByTestId('order-history')).toBeInTheDocument();
    
    // Check for the table title
    expect(screen.getByText('Order History')).toBeInTheDocument();
    
    // Check that the table rows are rendered for each order
    expect(screen.getAllByRole('row')).toHaveLength(mockOrders.length + 1); // +1 for the header row
  });
  
  it('renders a message when there are no orders', () => {
    render(<OrderHistory orders={[]} />);
    
    // Check that the "no orders" message is displayed
    expect(screen.getByTestId('order-history-no-orders')).toBeInTheDocument();
    expect(screen.getByText('No recent treasury orders found.')).toBeInTheDocument();
  });
}); 