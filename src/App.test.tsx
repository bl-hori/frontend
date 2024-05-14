import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import App from './App';

test("fetchNotes: ノート一覧が表示される", () => {
    render(<App />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
})