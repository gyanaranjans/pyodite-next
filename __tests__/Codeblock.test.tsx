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
    return <textarea data-testid="codemirror" value={value} />;
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
});