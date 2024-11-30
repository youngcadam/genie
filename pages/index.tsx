import { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React from "react";
import { API, Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [positivePrompt, setPositivePrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [steps, setSteps] = useState<number>(50);
  const [width, setWidth] = useState<number>(1024);
  const [height, setHeight] = useState<number>(1024);
  const [sampler, setSampler] = useState<string>("Euler");
  const [seed, setSeed] = useState<string>("");
  const [cfgScale, setCfgScale] = useState<number>(7.5);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  // Function to create a task in SQS
  async function createTask() {
    try {
      setStatus("Submitting task...");
      const uniqueImageKey = `generated-images/${uuidv4()}.png`; // Generate unique image key
      setImageKey(uniqueImageKey);

      await API.post("ImageGenerationAPI", "/tasks", {
        body: {
          positivePrompt,
          negativePrompt,
          steps,
          width,
          height,
          sampler,
          seed: seed || null,
          cfgScale,
          batchSize,
          imageKey: uniqueImageKey, // Pass unique key to backend
        },
      });

      setStatus("Task submitted. Waiting for image...");
      pollS3ForImage(uniqueImageKey);
    } catch (error) {
      console.error("Error submitting task:", error);
      setStatus("Error submitting task. Please try again.");
    }
  }

  // Function to poll S3 for the generated image
  async function pollS3ForImage(key: string) {
    const pollInterval = 3000; // 3 seconds
    const maxRetries = 20; // 60 seconds max wait time
    let attempts = 0;

    const checkImageExists = async () => {
      try {
        // Check if the image exists in the S3 bucket
        const signedUrl = await Storage.get(key, { level: "public" });
        setImageUrl(signedUrl);
        setStatus("Image ready!");
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          setStatus("Image generation timed out. Please try again.");
        } else {
          setTimeout(checkImageExists, pollInterval); // Retry after delay
        }
      }
    };

    checkImageExists();
  }

  return (
    <React.StrictMode>
      <Authenticator>
        <main
          style={{
            display: "flex",
            height: "100vh",
            padding: "20px",
            gap: "20px",
            backgroundColor: "rgb(40, 40, 40)",
            color: "white",
          }}
        >
          {/* Left Section: Prompts and Settings */}
          <section
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              backgroundColor: "rgb(50, 50, 50)",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h1 style={{ marginBottom: "10px" }}>AI Image Generator</h1>
            {/* Prompts */}
            <div>
              <label>
                <strong>Positive Prompt:</strong>
                <textarea
                  value={positivePrompt}
                  onChange={(e) => setPositivePrompt(e.target.value)}
                  placeholder="Describe what you want to generate"
                  style={{
                    width: "100%",
                    height: "80px",
                    padding: "10px",
                    resize: "none",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
            </div>
            <div>
              <label>
                <strong>Negative Prompt:</strong>
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Describe what you want to avoid"
                  style={{
                    width: "100%",
                    height: "80px",
                    padding: "10px",
                    resize: "none",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <label style={{ flex: "1" }}>
                Steps:
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
              <label style={{ flex: "1" }}>
                Width:
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
              <label style={{ flex: "1" }}>
                Height:
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <label style={{ flex: "1" }}>
                Sampler:
                <select
                  value={sampler}
                  onChange={(e) => setSampler(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                >
                  <option value="Euler">Euler</option>
                  <option value="Euler A">Euler A</option>
                  <option value="LMS">LMS</option>
                  <option value="DPM++ 2M SDE Karras">DPM++ 2M SDE Karras</option>
                  <option value="DPM++ 2S a Karras">DPM++ 2S a Karras</option>
                  <option value="DPM++ SDE Karras">DPM++ SDE Karras</option>
                  <option value="DPM++ 2M SDE Exponential">
                    DPM++ 2M SDE Exponential
                  </option>
                  <option value="DPM2 a">DPM2 a</option>
                  <option value="DPM++ 2S a">DPM++ 2S a</option>
                  <option value="DPM++ 3M *">DPM++ 3M *</option>
                </select>
              </label>
              <label style={{ flex: "1" }}>
                Seed:
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="Leave empty for random"
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
              <label style={{ flex: "1" }}>
                CFG Scale:
                <input
                  type="number"
                  value={cfgScale}
                  onChange={(e) => setCfgScale(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
              <label style={{ flex: "1" }}>
                Batch Size:
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "rgb(60, 60, 60)",
                    color: "white",
                  }}
                />
              </label>
            </div>
            <button
              onClick={createTask}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Generate Image
            </button>
            <p style={{ textAlign: "center", marginTop: "10px" }}>{status}</p>
          </section>

          {/* Right Section: Image Output */}
          <section
            style={{
              flex: "1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(50, 50, 50)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              padding: "20px",
              textAlign: "center",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated result"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                }}
              />
            ) : (
              <p>No image yet. Submit a prompt to generate one.</p>
            )}
          </section>
        </main>
      </Authenticator>
    </React.StrictMode>
  );
}
