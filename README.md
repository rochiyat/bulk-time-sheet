# Bulk Time Sheet

## Overview
Bulk Time Sheet is a tool designed to streamline the process of logging activities and timesheets. It interacts with the Talenta platform to automate the entry of time-related data.

## Prerequisites
- Ensure that Node.js is installed on your operating system. You can download it from [Node.js Official Website](https://nodejs.org/).

## Installation

1. **Clone the Repository**
   ```
   git clone <repository-url>
   ```
   Replace `<repository-url>` with the URL of your GitHub repository.

2. **Install Dependencies**
   Navigate to the project directory and install the required dependencies using npm:
   ```
   npm install
   ```

## Environment Configuration
To configure the project, you need to set up a `.env` file with the necessary environment variables. Please contact the project manager (PM) for the specific environment variables required.

## Usage

### Authentication
Before running tests or using the application, you need to log in to the Talenta platform to retrieve the Cookie value. Follow these steps:

1. Log in to [Talenta](https://www.talenta.co/).
2. Open the browser's Developer Tools (F12) and navigate to the **Network** tab.
3. Perform any action on Talenta that sends a network request.
4. Locate the request and go to the **Headers** or **Payload** section.
5. Copy the value of the `Cookie` field.

### Testing
You can test the application using tools like Postman, Apidog, or any similar API testing tool. Here's an example using `curl`:

```bash
curl --location --request POST 'http://localhost:4000/bulk' \
--header 'Cookie: {{cookie}}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "taskId": 127536,
  "activity": "Development Deeplink MCU and Support Production",
  "startDate": "2024-07-25",
  "endDate": "2024-07-28"
}'
```

Replace `{{cookie}}` with the Cookie value obtained from Talenta.

## Contributing
Feel free to fork this repository and contribute to the project. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

---

Let me know if you'd like any modifications or additional details!
