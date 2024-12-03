import { useState } from "react";
import { Amplify } from 'aws-amplify';
import { Authenticator } from "@aws-amplify/ui-react";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import outputs from '../amplify_outputs.json';
import "@aws-amplify/ui-react/styles.css";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

Amplify.configure(outputs);

const client = generateClient<Schema>();

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  // Placeholder for task submission (to be implemented)
  async function submitTask() {
    const uniqueImageKey = `${uuidv4()}.png`;
    setStatus("Submitting task...");

    const taskArguments = {
      positivePrompt: positivePrompt || "",
      negativePrompt: negativePrompt || "",
      steps: steps || 50,
      width: width || 1024,
      height: height || 1024,
      sampler: sampler || "Euler",
      seed: seed || "random-seed",
      cfgScale: cfgScale || 7.5,
      batchSize: batchSize || 1,
      imageKey: uniqueImageKey,
    };

    console.log("Prepared task arguments:", taskArguments);

    try {
      // Send the taskArguments to the query
      const response = await client.queries.taskQuery(taskArguments);

      console.log("Response from taskQuery:", response);

      if (response.errors) {
        console.error("Error invoking taskQuery:", response.errors);
        setStatus("Failed to submit task. Check console for errors.");
        return;
      }

      if (response.data) {
        setStatus("Task submitted successfully! Polling for result...");

        // Poll S3 for the image
        const bucketUrl = `https://generated-images-amplify.s3.us-west-2.amazonaws.com`;
        const imageUrl = `${bucketUrl}/${uniqueImageKey}`;
  
        const pollInterval = 8000; // 3 seconds
        const maxAttempts = 30; // Give up after 30 attempts (90 seconds)
        let attempts = 0;
  
        const pollS3 = async () => {
          try {
            const response = await fetch(imageUrl, { method: "HEAD" });
  
            if (response.ok) {
              setImageUrl(imageUrl);
              setStatus("Task completed! Image ready.");
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(pollS3, pollInterval);
            } else {
              setStatus("Failed to retrieve the generated image. Timeout reached.");
            }
          } catch (error) {
            console.error("Error polling S3:", error);
            if (attempts < maxAttempts) {
              attempts++;
              setTimeout(pollS3, pollInterval);
            } else {
              setStatus("Failed to retrieve the generated image. Timeout reached.");
            }
          }
        };

        pollS3();
      } else {
        setStatus("Failed to submit task. No data returned.");
      }
    } catch (error) {
      console.error("Error invoking Lambda:", error);
      setStatus("An error occurred while submitting the task.");
    }
  }

  return (
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
                <option value="LMS">LMS</option>
                <option value="DDIM">DDIM</option>
                <option value="PLMS">PLMS</option>
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
          </div>
          <button
            onClick={submitTask}
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
            Submit Task
          </button>
          <p style={{ textAlign: "center" }}>{status}</p>
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
            <Image
              src={imageUrl}
              alt="Generated result"
              layout="responsive"
              width={1024}
              height={1024}
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
            />
          ) : (
            <p>No image yet. Submit a task to generate one.</p>
          )}
        </section>
      </main>
    </Authenticator>
  );
}
