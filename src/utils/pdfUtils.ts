
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export interface BookingForInvoice {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  amount: string;
  status: string;
  vehicleType?: string;
  passengerCount?: number;
  distance?: string;
}

export const generateInvoicePDF = async (booking: BookingForInvoice) => {
  // Create a temporary div to render the invoice
  const invoiceDiv = document.createElement("div");
  invoiceDiv.style.padding = "20px";
  invoiceDiv.style.width = "800px";
  invoiceDiv.style.backgroundColor = "#ffffff";
  
  // Add invoice content
  invoiceDiv.innerHTML = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <h1 style="color: #4f46e5; margin-bottom: 5px;">RIDE INVOICE</h1>
          <p style="margin: 0; color: #666;">Invoice #: ${booking.id}</p>
          <p style="margin: 0; color: #666;">Date: ${booking.date}</p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0;">VehicleGo</h2>
          <p style="margin: 0; color: #666;">123 Transport Street</p>
          <p style="margin: 0; color: #666;">Colombo, Sri Lanka</p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h3 style="margin-bottom: 10px;">Trip Details</h3>
        <div style="display: flex; margin-bottom: 10px;">
          <div style="width: 50%;">
            <p style="margin: 0; font-weight: bold;">Pickup Location:</p>
            <p style="margin: 0; color: #666;">${booking.pickup}</p>
          </div>
          <div style="width: 50%;">
            <p style="margin: 0; font-weight: bold;">Destination:</p>
            <p style="margin: 0; color: #666;">${booking.destination}</p>
          </div>
        </div>
        <div style="display: flex;">
          <div style="width: 50%;">
            <p style="margin: 0; font-weight: bold;">Vehicle Type:</p>
            <p style="margin: 0; color: #666;">${booking.vehicleType || 'Standard'}</p>
          </div>
          <div style="width: 50%;">
            <p style="margin: 0; font-weight: bold;">Passengers:</p>
            <p style="margin: 0; color: #666;">${booking.passengerCount || 1}</p>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="margin-bottom: 10px;">Fare Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9fafb;">
            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #eee;">Description</th>
            <th style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">Amount</th>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Base Fare</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">LKR ${(parseFloat(booking.amount) * 0.7).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Distance Charge (${booking.distance || '0'} km)</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">LKR ${(parseFloat(booking.amount) * 0.2).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">Service Fee</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">LKR ${(parseFloat(booking.amount) * 0.1).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td style="padding: 10px;">Total</td>
            <td style="text-align: right; padding: 10px;">LKR ${booking.amount}</td>
          </tr>
        </table>
      </div>
      
      <div style="margin-top: 40px; color: #666; font-size: 14px; text-align: center;">
        <p>Thank you for choosing VehicleGo for your journey.</p>
        <p>For any inquiries, please contact support@vehiclego.com</p>
      </div>
    </div>
  `;
  
  // Append the div to the document body
  document.body.appendChild(invoiceDiv);
  
  try {
    // Convert the div to canvas
    const canvas = await html2canvas(invoiceDiv, {
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    // Initialize PDF
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    
    // Add canvas to PDF
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    // Download PDF
    pdf.save(`invoice-${booking.id}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    // Remove the temporary div
    document.body.removeChild(invoiceDiv);
  }
};
