# Stable Diffusion Image Generation App (Demo)

This repository showcases a demo application for generating images using Stable Diffusion, powered by a custom backend built with AWS Amplify. The app demonstrates how to integrate a Next.js frontend with AWS services to queue image generation tasks, process them with a backend worker, and deliver results to users.

## Overview

This demo app provides a user-friendly interface for generating AI-generated images using Stable Diffusion. Users can specify positive and negative prompts, adjust generation settings, and view the generated images directly in the browser. The backend efficiently manages tasks using AWS services, showcasing a scalable architecture for AI workloads.

## Features

- **Frontend**: Built with Next.js, offering a responsive UI for inputting prompts and adjusting image generation settings.
- **Backend**: Powered by AWS Amplify, with:
  - **Authentication**: Secure user access with Amazon Cognito.
  - **Task Management**: AWS SQS for managing image generation tasks.
  - **Lambda Integration**: Serverless function for task processing and communication.
  - **Storage**: Generated images are stored and served from Amazon S3.
- **Dynamic Settings**: Users can customize image dimensions, sampling methods, seed values, and more.
- **Scalable Architecture**: Demonstrates best practices for handling AI workloads on AWS.

## How It Works

1. **Submit Task**: Users specify prompts and settings via the Next.js frontend.
2. **Task Queueing**: Tasks are queued in AWS SQS for processing.
3. **Backend Processing**: A backend worker polls the queue, generates images using Stable Diffusion, and uploads results to S3.
4. **Result Delivery**: The frontend polls S3 to fetch and display the generated image when ready.

## Getting Started

### Prerequisites
- Node.js and npm installed.
- AWS CLI configured with appropriate access.
- An AWS Amplify app set up and connected to this project.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url/stable-diffusion-demo.git
   cd stable-diffusion-demo
