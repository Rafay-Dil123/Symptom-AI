
import './App.css';
import MedicalImageUpload from './components/medical-image-upload';

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 9h-5V4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-5Z" />
                  <path d="M14 4v5h5" />
                  <path d="M9 14h6" />
                  <path d="M12 11v6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MediScan Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-sky-600 hover:text-sky-800">Help</button>
              <button className="text-sm font-medium text-sky-600 hover:text-sky-800">Contact</button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl">
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Medical Imaging Analysis</h2>
            <p className="mb-4 text-gray-600">
              Upload neuroimaging files (.nii format) and MRI scans along with patient information for processing and
              analysis.
            </p>
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg> */}
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Please ensure all patient information is accurate and files are in the correct format.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <MedicalImageUpload />
        </div>
      </div>
    </main>
  );
}

export default App;
