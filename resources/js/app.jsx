import './bootstrap';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Hospital Management System</h1>
                <p className="mb-4">React SPA running inside Laravel</p>
                <button
                    onClick={() => setCount((c) => c + 1)}
                    className="px-4 py-2 bg-[#1b1b18] dark:bg-[#EDEDEC] text-white dark:text-[#1b1b18] rounded-sm"
                >
                    Count is {count}
                </button>
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
