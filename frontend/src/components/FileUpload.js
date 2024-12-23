import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [fileType, setFileType] = useState("users"); // New state for file type

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Update URL based on the selected file type (users or members)
      const res = await axios.post(
        `http://localhost:5001/api/upload/csv/${fileType}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(res.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file");
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <form onSubmit={handleUpload}>
        {/* Select File Type (users or members) */}
        <select onChange={handleFileTypeChange} value={fileType}>
          <option value="users">Users</option>
          <option value="members">Members</option>
        </select>
        <br />
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
