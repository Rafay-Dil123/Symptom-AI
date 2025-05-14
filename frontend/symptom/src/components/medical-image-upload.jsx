"use client"

import { useState } from "react"
import "./medical-image-upload.css"

export default function MedicalImageUpload() {
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "male",
    weight: 70,
    height: "",
    medicalHistory: "",
  })

  const [niiFile, setNiiFile] = useState(null)
  const [mriFile, setMriFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("patient-info")

  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target
    setPatientInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (e) => {
    setPatientInfo((prev) => ({ ...prev, gender: e.target.value }))
  }

  const handleWeightChange = (e) => {
    setPatientInfo((prev) => ({ ...prev, weight: e.target.value }))
  }

  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (fileType === "nii") {
        setNiiFile(file)
      } else {
        setMriFile(file)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!niiFile || !mriFile) {
      alert("Please upload both required image files")
      return
    }

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      alert("Files uploaded successfully! Processing will begin shortly.")
    }, 2000)

    // In a real application, you would create a FormData object and send it to your backend
    // const formData = new FormData()
    // formData.append('niiFile', niiFile)
    // formData.append('mriFile', mriFile)
    // formData.append('patientInfo', JSON.stringify(patientInfo))
    // await fetch('/api/upload', { method: 'POST', body: formData })
  }

  const switchTab = (tabName) => {
    setActiveTab(tabName)
  }

  return (
    <form onSubmit={handleSubmit} className="medical-form">
      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === "patient-info" ? "active" : ""}`}
          onClick={() => switchTab("patient-info")}
        >
          Patient Information
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "image-upload" ? "active" : ""}`}
          onClick={() => switchTab("image-upload")}
        >
          Image Upload
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "review" ? "active" : ""}`}
          onClick={() => switchTab("review")}
        >
          Review & Submit
        </button>
      </div>

      {activeTab === "patient-info" && (
        <div className="card">
          <div className="card-content">
            <div className="form-grid">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="name">Patient Name</label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Full name"
                    value={patientInfo.name}
                    onChange={handlePatientInfoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Age in years"
                    value={patientInfo.age}
                    onChange={handlePatientInfoChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group">
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={patientInfo.gender === "male"}
                      onChange={handleGenderChange}
                    />
                    <label htmlFor="male">Male</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={patientInfo.gender === "female"}
                      onChange={handleGenderChange}
                    />
                    <label htmlFor="female">Female</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="other"
                      name="gender"
                      value="other"
                      checked={patientInfo.gender === "other"}
                      onChange={handleGenderChange}
                    />
                    <label htmlFor="other">Other</label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg): {patientInfo.weight}</label>
                <input
                  id="weight"
                  type="range"
                  min="10"
                  max="200"
                  step="1"
                  value={patientInfo.weight}
                  onChange={handleWeightChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  placeholder="Height in centimeters"
                  value={patientInfo.height}
                  onChange={handlePatientInfoChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="medicalHistory">Medical History</label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  rows={3}
                  placeholder="Relevant medical history, conditions, or medications"
                  value={patientInfo.medicalHistory}
                  onChange={handlePatientInfoChange}
                />
              </div>

              <div className="button-container">
                <button type="button" className="button primary" onClick={() => switchTab("image-upload")}>
                  Continue to Image Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "image-upload" && (
        <div className="card">
          <div className="card-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="scan-type">Scan Type</label>
                <select id="scan-type" defaultValue="brain" className="select">
                  <option value="brain">Brain MRI</option>
                  <option value="spine">Spine</option>
                  <option value="cardiac">Cardiac</option>
                  <option value="abdominal">Abdominal</option>
                  <option value="musculoskeletal">Musculoskeletal</option>
                </select>
              </div>

              <div className="form-group">
                <label>NIfTI File (.nii)</label>
                <div className="file-upload-container">
                  <div className="file-upload-content">
                    <div className="file-icon">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                        <path d="M7 2v20"></path>
                        <path d="M17 2v20"></path>
                        <path d="M2 12h20"></path>
                        <path d="M2 7h5"></path>
                        <path d="M2 17h5"></path>
                        <path d="M17 17h5"></path>
                        <path d="M17 7h5"></path>
                      </svg>
                    </div>
                    <div className="file-text">
                      <label htmlFor="nii-file" className="file-upload-label">
                        <span>Upload a file</span>
                        <input
                          id="nii-file"
                          name="nii-file"
                          type="file"
                          className="hidden-input"
                          accept=".nii,.nii.gz"
                          onChange={(e) => handleFileChange(e, "nii")}
                        />
                      </label>
                      <p>or drag and drop</p>
                    </div>
                    <p className="file-hint">NIfTI files (.nii, .nii.gz)</p>
                  </div>
                </div>
                {niiFile && (
                  <div className="file-success">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{niiFile.name} uploaded</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>MRI File</label>
                <div className="file-upload-container">
                  <div className="file-upload-content">
                    <div className="file-icon">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                        <path d="M7 2v20"></path>
                        <path d="M17 2v20"></path>
                        <path d="M2 12h20"></path>
                        <path d="M2 7h5"></path>
                        <path d="M2 17h5"></path>
                        <path d="M17 17h5"></path>
                        <path d="M17 7h5"></path>
                      </svg>
                    </div>
                    <div className="file-text">
                      <label htmlFor="mri-file" className="file-upload-label">
                        <span>Upload a file</span>
                        <input
                          id="mri-file"
                          name="mri-file"
                          type="file"
                          className="hidden-input"
                          accept=".dcm,.dicom,.ima,.img"
                          onChange={(e) => handleFileChange(e, "mri")}
                        />
                      </label>
                      <p>or drag and drop</p>
                    </div>
                    <p className="file-hint">DICOM files (.dcm, .dicom, .ima, .img)</p>
                  </div>
                </div>
                {mriFile && (
                  <div className="file-success">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{mriFile.name} uploaded</span>
                  </div>
                )}
              </div>

              <div className="info-box blue">
                <div className="info-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>File format information</h3>
                  <p>
                    NIfTI (.nii) files are used for storing neuroimaging data. DICOM files are the standard format for
                    medical imaging. Please ensure your files are in the correct format before uploading.
                  </p>
                </div>
              </div>

              <div className="button-container space-between">
                <button type="button" className="button outline" onClick={() => switchTab("patient-info")}>
                  Back
                </button>
                <button
                  type="button"
                  className="button primary"
                  onClick={() => switchTab("review")}
                  disabled={!niiFile || !mriFile}
                >
                  Continue to Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "review" && (
        <div className="card">
          <div className="card-content">
            <div className="form-grid">
              <div>
                <h3 className="section-title">Review Patient Information</h3>
                <div className="review-grid">
                  <div>
                    <p className="field-label">Name</p>
                    <p>{patientInfo.name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="field-label">Age</p>
                    <p>{patientInfo.age || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="field-label">Gender</p>
                    <p style={{ textTransform: "capitalize" }}>{patientInfo.gender}</p>
                  </div>
                  <div>
                    <p className="field-label">Weight</p>
                    <p>{patientInfo.weight} kg</p>
                  </div>
                  <div>
                    <p className="field-label">Height</p>
                    <p>{patientInfo.height ? `${patientInfo.height} cm` : "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="section-title">Review Files</h3>
                <div className="review-grid">
                  <div className="file-review">
                    <p className="field-label">NIfTI File</p>
                    <p className="truncate">{niiFile ? niiFile.name : "No file uploaded"}</p>
                  </div>
                  <div className="file-review">
                    <p className="field-label">MRI File</p>
                    <p className="truncate">{mriFile ? mriFile.name : "No file uploaded"}</p>
                  </div>
                </div>
              </div>

              <div className="info-box yellow">
                <div className="info-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Important Notice</h3>
                  <p>
                    By submitting this form, you confirm that you have the necessary permissions to upload and process
                    these medical images. All data will be handled according to HIPAA regulations and hospital privacy
                    policies.
                  </p>
                </div>
              </div>

              <div className="button-container space-between">
                <button type="button" className="button outline" onClick={() => switchTab("image-upload")}>
                  Back
                </button>
                <button type="submit" className="button primary" disabled={isUploading || !niiFile || !mriFile}>
                  {isUploading ? (
                    <>
                      <svg
                        className="spinner"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      Submit Files
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
