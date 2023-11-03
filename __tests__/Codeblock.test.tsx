import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Codeblock from '@/components/Codeblock';
import { usePython } from 'react-py';

jest.mock('react-py', () => ({
  usePython: jest.fn(),
}));

jest.mock('@uiw/react-codemirror', () => {
  return jest.fn().mockImplementation(({ value, onChange }) => {
    React.useEffect(() => {
      onChange('print("Hello, World!")');
    }, []);
    return <textarea data-testid="codemirror" value={value} onChange={()=>{}}/>;
  });
});

describe('Codeblock', () => {
  it('renders without crashing and can run python code', async () => {
    const mockRunPython = jest.fn();
    (usePython as jest.Mock).mockReturnValue({
      runPython: mockRunPython,
      stdout: 'test output',
      stderr: '',
      isLoading: false,
      isRunning: false,
    });

    const { getByText, getByTestId } = render(<Codeblock />);

    const runButton = getByText('Run');
    const codeMirror = getByTestId('codemirror');

    fireEvent.click(runButton);

    await waitFor(() => expect(mockRunPython).toHaveBeenCalledWith('print("Hello, World!")'));

    expect(getByText('test output')).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    (usePython as jest.Mock).mockReturnValue({
      runPython: jest.fn(),
      stdout: '',
      stderr: '',
      isLoading: true,
      isRunning: false,
    });

    const { getByText } = render(<Codeblock />);

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('displays running state correctly', () => {
    (usePython as jest.Mock).mockReturnValue({
      runPython: jest.fn(),
      stdout: '',
      stderr: '',
      isLoading: false,
      isRunning: true,
    });

    const { getByText } = render(<Codeblock />);

    expect(getByText('Running...')).toBeInTheDocument();
  });

  it('displays error correctly', () => {
    (usePython as jest.Mock).mockReturnValue({
      runPython: jest.fn(),
      stdout: '',
      stderr: 'test error',
      isLoading: false,
      isRunning: false,
    });

    const { getByText } = render(<Codeblock />);

    expect(getByText('test error')).toBeInTheDocument();
  });
});
