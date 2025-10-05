export const generateRecordTableHtml = (data, logoUri) => {
  const tableRows = data
    .map(
      (item) =>
        `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.servicedBy}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.requestType}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.details}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.status}</td>
        </tr>`
    )
    .join("");

  const currentDate = new Date().toLocaleString();

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @page {
            margin: 100px 30px 60px 30px;
            counter-increment: page;
          }

          body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
          }

          header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #075538;
            color: #CED46A;
            text-align: center;
            padding: 15px 0;
          }

          header img {
            width: 80px;
            height: auto;
            margin-bottom: 6px;
          }

          header h1 {
            margin: 0;
            font-size: 22px;
          }

          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 14px;
          }

          th, td {
            padding: 10px;
            border: 1px solid #ddd;
          }

          thead {
            background-color: #f2f2f2;
          }

         
          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: #555;
            padding: 8px 0;
            border-top: 1px solid #ddd;
          }

          footer::after {
            content: "Page " counter(page);
          }
        </style>
      </head>

      <body>
        <!-- Header -->
        <header>
          <img src="${logoUri}" alt="Company Logo" />
          <h1>Mechanic Service Records</h1>
        </header>

        <!-- Body content -->
        <main style="padding: 120px 20px 80px 20px;">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Request Type</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </main>

        <!-- Footer -->
        <footer>
          <p style="margin: 0;">
            Generated on ${currentDate} by <strong>RoadMateAssist</strong> —
            <span style="font-style: italic;">Page </span>
          </p>
        </footer>
      </body>
    </html>
  `;
};
